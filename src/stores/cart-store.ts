import { Cart } from "@/types/cart";
import { CartProduct } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type States = {
  cart: Cart[];
};

type Actions = {
  upsertCartItem: (product: CartProduct, quantity: number) => void;
  clearCart: () => void;
};

const initialState: States = {
  cart: [],
};

export const useCartStore = create<States & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      upsertCartItem: (product, quantity) =>
        set((state) => {
          let newCart = state.cart;

          // Search for the product inside the cart
          let productIndex = newCart.findIndex(
            (item) => item.product.id === product.id
          );

          // If the product does not exist in the cart, add it
          if (productIndex < 0) {
            newCart.push({ product, quantity: 0 });
            productIndex = newCart.findIndex(
              (item) => item.product.id === product.id
            );
          }

          // Add the quantity for that product
          newCart[productIndex].quantity += quantity;

          // if the product doesn't have a quantity, remove that product
          if (newCart[productIndex].quantity <= 0) {
            newCart = newCart.filter((item) => item.product.id !== product.id);
          }

          return { ...state, cart: newCart };
        }),
      clearCart: () => {
        set(() => {
          return { cart: [] };
        });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
