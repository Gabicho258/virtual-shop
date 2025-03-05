"use client";

import { QuantitySelector, SizeSelector } from "@/components";
import type { CartProduct, Product, Size } from "@/interfaces";
import { useCartStore } from "@/store";
import { useState } from "react";

interface Props {
  product: Product;
}
export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addToCart);

  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [errorPosted, setErrorPosted] = useState(false);

  const addToCart = () => {
    setErrorPosted(true);
    if (size === undefined) return;
    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      image: product.images[0],
    };
    addProductToCart(cartProduct);
    setErrorPosted(false);
    setQuantity(1);
    setSize(undefined);
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
