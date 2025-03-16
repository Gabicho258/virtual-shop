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

  console.log({ subTotal, tax, total });
};
