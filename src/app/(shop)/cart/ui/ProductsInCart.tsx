"use client";

import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);

  const updateProductQuantity = useCartStore((state) => state.updateQuantity);

  const removeProductFromCart = useCartStore((state) => state.removeFromCart);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Loading</p>;
  }

  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <ProductImage
            src={product.image}
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.title}
            className="mr-5 rounded"
          />
          <div>
            <Link
              href={`/product/${product.slug}`}
              className="hover:underline cursor-pointer "
            >
              {product.title} - {product.size}
            </Link>
            <p>${product.price.toFixed(2)}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantityChange={(value) =>
                updateProductQuantity(product, value)
              }
            />
            <button
              className="underline mt-3"
              onClick={() => removeProductFromCart(product)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
