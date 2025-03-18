import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  addToCart: (product: CartProduct) => void;
  getTotalItems: () => number;
  getSummaryInformation: () => {
    subTotal: number;
    tax: number;
    total: number;
    totalItems: number;
  };
  updateQuantity: (product: CartProduct, quantity: number) => void;
  removeFromCart: (product: CartProduct) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product: CartProduct) => {
        const { cart } = get();
        // Check if the product has already been added with the selected size
        const existingProduct = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        if (!existingProduct) {
          set({ cart: [...cart, product] });
          return;
        }
        // The product has already been added, so update the quantity
        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: product.quantity + item.quantity };
          }

          return item;
        });

        set({ cart: updatedCartProducts });
      },
      getTotalItems: () => {
        const { cart } = get();

        return cart.reduce((sum, item) => sum + item.quantity, 0);
      },
      updateQuantity: (product, quantity) => {
        const { cart } = get();
        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity };
          }
          return item;
        });
        set({ cart: updatedCartProducts });
      },
      removeFromCart: (product) => {
        const { cart } = get();
        const updatedCartProducts = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size
        );
        set({ cart: updatedCartProducts });
      },
      getSummaryInformation: () => {
        const { cart } = get();
        const subTotal = cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const tax = subTotal * 0.18;
        const total = subTotal + tax;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        return { subTotal, tax, total, totalItems };
      },
      clearCart: () => {
        set({ cart: [] });
      },
    }),
    { name: "shoping-cart" }
  )
);
