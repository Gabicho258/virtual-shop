"use server";

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (transactionId: string) => {
  const authToken = await getPaypalBearerToken();
  if (!authToken) {
    return { ok: false, message: "Can not get authorization token" };
  }
  const resp = await verifyPayPalPayment(transactionId, authToken);
  if (!resp) {
    return { ok: false, message: "Can not verify payment" };
  }
  const { status, purchase_units } = resp;
  const { invoice_id: orderId } = purchase_units[0];

  if (status !== "COMPLETED") {
    return { ok: false, message: "Payment not completed" };
  }

  try {
    console.log({ status, purchase_units });
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });
    revalidatePath(`/orders/${orderId}`);
  } catch (error) {
    console.log(error);
    return { ok: false, message: "Payment can not be done" };
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const OAUTH2_URL = process.env.PAYPAL_OAUTH_URL;

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const resolve = await fetch(`${OAUTH2_URL}`, {
      ...requestOptions,
      cache: "no-store",
    }).then((response) => response.json());
    return resolve.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyPayPalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const PAYPAL_ORDER_URL = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const resolve = await fetch(PAYPAL_ORDER_URL, {
      ...requestOptions,
      cache: "no-store",
    }).then((resp) => resp.json());

    return resolve;
  } catch (error) {
    console.log(error);
    return null;
  }
};
