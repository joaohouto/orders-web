import { useCartStore } from "@/stores/cart-store";
import { moneyFormatter } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

export function MobileCartBar() {
  const { cart, openCart } = useCartStore((state) => state);

  const cartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );

  if (cartItems === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-dashed bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <button
        onClick={openCart}
        className="w-full flex items-center gap-3 px-4 py-4 active:bg-muted/50 transition-colors"
      >
        <div className="flex -space-x-2.5">
          {cart.slice(0, 3).map((item) => (
            <img
              key={item.product.cartKey}
              src={item.product.images?.[0]}
              alt={item.product.name}
              className="size-11 rounded-sm border-2 border-background object-contain bg-[#F4F4F5] flex-shrink-0"
            />
          ))}
        </div>
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="text-sm font-semibold leading-tight">
            {cartItems} {cartItems === 1 ? "item" : "itens"} no carrinho
          </span>
          <span className="text-xs text-muted-foreground">
            {moneyFormatter.format(cartSubtotal)}
          </span>
        </div>
        <div className="size-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <ShoppingCart className="size-4 text-primary-foreground" />
        </div>
      </button>
    </div>
  );
}
