"use client";
import { paypalCheckPayment, setTransactionId } from "@/actions";
import {
  CreateOrderActions,
  CreateOrderData,
  OnApproveActions,
  OnApproveData,
} from "@paypal/paypal-js";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

interface Props {
  orderId: string;
  amount: number;
}

export const PayPalButton = ({ amount, orderId }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = Math.round(amount * 100) / 100;

  if (isPending) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-300 rounded" />
        <div className="h-10 mt-2 bg-gray-300 rounded" />
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            value: `${roundedAmount}`,
            currency_code: "USD",
          },
        },
      ],
    });
    const { ok } = await setTransactionId(orderId, transactionId);

    if (!ok) {
      throw new Error("Could not update order");
    }

    console.log(transactionId);

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();
    if (!details) return;

    await paypalCheckPayment(details.id ?? "");
  };

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};
