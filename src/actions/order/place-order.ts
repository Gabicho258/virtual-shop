"use server";

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  if (!session?.user.id) {
    return {
      ok: false,
      message: "There is no user session",
    };
  }
  // get information about the products to order
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((product) => product.productId),
      },
    },
  });
  // cuantity of products to order
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

  // total, subtotal, tax
  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`${item.productId} do not exist - Error 500`);
      }
      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.18;
      totals.total += subTotal * 1.18;
      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // Update product stock
      const updatedProductsPromises = products.map(async (product) => {
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} does not have enough inventory`);
        }
        return tx.product.update({
          where: { id: product.id },
          data: {
            // inStock: product.inStock - productQuantity, don't do
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} does not have enough inventory`);
        }
      });

      // Create Order header and details

      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,
          OrderItem: {
            createMany: {
              data: productIds.map((product) => {
                return {
                  quantity: product.quantity,
                  size: product.size,
                  productId: product.productId,
                  price:
                    products.find((p) => p.id === product.productId)?.price ??
                    0,
                };
              }),
            },
          },
        },
      });

      // Create address delivery

      const { country, ...restAddress } = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          orderId: order.id,
          countryId: country,
          ...restAddress,
        },
      });

      return {
        order: order,
        orderAddress: orderAddress,
        updatedProducts: updatedProducts,
      };
    });
    return { ok: true, order: prismaTx.order, prismaTx };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }
};
