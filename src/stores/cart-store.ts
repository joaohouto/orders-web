import { Cart } from "@/types/cart";
import { CartProduct } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type States = {
  cart: Cart[];
  isCartOpen: boolean;
};

type Actions = {
  upsertCartItem: (product: CartProduct, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const initialState: States = {
  cart: [],
  isCartOpen: false,
};

export const useCartStore = create<States & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      upsertCartItem: (product, quantity) =>
        set((state) => {
          let newCart = state.cart;

          // Search for the product inside the cart by cartKey
          let productIndex = newCart.findIndex(
            (item) => item.product.cartKey === product.cartKey
          );

          // If the product does not exist in the cart, add it
          if (productIndex < 0) {
            newCart.push({ product, quantity: 0 });
            productIndex = newCart.findIndex(
              (item) => item.product.cartKey === product.cartKey
            );
          }

          // Add the quantity for that product
          newCart[productIndex].quantity += quantity;

          // if the product doesn't have a quantity, remove that product
          if (newCart[productIndex].quantity <= 0) {
            newCart = newCart.filter((item) => item.product.cartKey !== product.cartKey);
          }

          return { ...state, cart: newCart };
        }),
      clearCart: () => set(() => ({ cart: [] })),
      openCart: () => set(() => ({ isCartOpen: true })),
      closeCart: () => set(() => ({ isCartOpen: false })),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
