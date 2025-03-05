"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const OrderSummary = () => {
  const [loaded, setLoaded] = useState(false);
  const { subTotal, tax, total, totalItems } = useCartStore(
    useShallow((state) => state.getSummaryInformation())
  );
  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <div>Loading...</div>;
  return (
    <div className="grid grid-cols-2">
      <span>N° products</span>

      <span className="text-right">
        {totalItems === 1 ? "1 item" : `${totalItems} items`}
      </span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subTotal)}</span>
      <span>Taxes (18%)</span>
      <span className="text-right">{currencyFormat(tax)}</span>
      <span className="mt-5 text-2xl">Total: </span>
      <span className="mt-5 text-2xl text-right">{currencyFormat(total)} </span>
    </div>
  );
};
