"use client";

import { QuantitySelector, SizeSelector } from "@/components";
import { Product, Size } from "@/interfaces";
import { useState } from "react";

interface Props {
  product: Product;
}
export const AddToCart = ({ product }: Props) => {
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [errorPosted, setErrorPosted] = useState(false);

  const addToCart = () => {
    setErrorPosted(true);
    if (size === undefined) return;
  };

  return (
    <>
      {errorPosted && !size && (
        <span className="mt-2 text-red-500 fade-in">
          You should select the size
        </span>
      )}

      {/* size selector */}
      <SizeSelector
        selectedSize={size}
        sizes={product.sizes}
        onSizeSelected={setSize}
      />
      {/* quantity selector */}
      <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />

      {/* button */}
      <button className="btn-primary my-5" onClick={addToCart}>
        Add to cart
      </button>
    </>
  );
};
