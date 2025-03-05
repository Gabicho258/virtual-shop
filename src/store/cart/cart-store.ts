import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  addToCart: (product: CartProduct) => void;
  //   removeFromCart: (product: CartProduct) => void;
  //   updateQuantity: (product: CartProduct, quantity: number) => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product: CartProduct) => {
        const { cart } = get();
        console.log({ cart });
        console.log({ product });
        // Check if the product has already been added with the selected size
        const existingProduct = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );
        console.log("exists", existingProduct);

        if (!existingProduct) {
          console.log("entra en exiting product: ");
          set({ cart: [...cart, product] });
          return;
        }
        // The product has already been added, so update the quantity
        const updatedCartProducts = cart.map((item) => {
          console.log("item", item);
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: product.quantity + item.quantity };
          }

          return item;
        });

        console.log("update quanquiti: ", updatedCartProducts);
        set({ cart: updatedCartProducts });
      },
    }),
    { name: "shoping-cart" }
  )
);
