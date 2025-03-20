import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (orderId: string) => {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User not authenticated");
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        OrderAddress: true,
        OrderItem: {
          include: {
            product: {
              select: {
                ProductImage: true,
                title: true,
                id: true,
              },
            },
          },
        },
      },
    });
    if (!order) {
      throw new Error("Order not found");
    }

    if (session.user.role === "user") {
      if (session.user.id !== order.userId) {
        throw new Error("Unauthorized to view this order");
      }
    }

    return order;
  } catch (error) {
    console.log(error);
  }
};
