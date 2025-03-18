"use client";

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const address = useAddressStore((state) => state.address);
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const { subTotal, tax, total, totalItems } = useCartStore(
    useShallow((state) => state.getSummaryInformation())
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const resp = await placeOrder(productsToOrder, address);
    console.log(resp);
    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message);
      return;
    }
    clearCart();
    router.replace(`/orders/${resp.order?.id}`);
  };

  if (!loaded) return <div>Loading...</div>;
  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2 font-bold">Address to deliver</h2>
      <div className="mb-10">
        <p className="text-xl">{address.firstName}</p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.postalCode}</p>
        <p>{address.phone}</p>
      </div>
      {/* divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Order summary</h2>
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
        <span className="mt-5 text-2xl text-right">
          {currencyFormat(total)}{" "}
        </span>
      </div>
      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          <span className="text-xs">
            {'Clicking "Add order", you accept our '}{" "}
            <a href="#" className="underline">
              terms and conditions
            </a>
          </span>
        </p>
        <p className="text-red-500 mb-5">{errorMessage}</p>
        <button
          //   href={"/orders/123"}
          onClick={onPlaceOrder}
          disabled={isPlacingOrder}
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
        >
          Add order
        </button>
      </div>
    </div>
  );
};
