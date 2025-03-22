"use server";

import prisma from "@/lib/prisma";

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  try {
    const orderUpdated = await prisma.order.update({
      where: { id: orderId },
      data: {
        transactionId,
      },
    });

    if (!orderUpdated) {
      throw new Error("Order not found");
    }

    return {
      ok: true,
      orderUpdated,
      message: "Transaction ID set successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: " Can not set transaction ID",
    };
  }
};
