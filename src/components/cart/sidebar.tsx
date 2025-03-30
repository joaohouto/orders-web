import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBasketIcon, ShoppingCartIcon } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { CartItem } from "./item";
import { useState } from "react";
import { moneyFormatter } from "@/lib/utils";

export const CartSidebar = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const { cart } = useCartStore((state) => state);

  let subtotal = 0;
  for (const item of cart) {
    subtotal += item.quantity * item.product.price;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="relative">
          <ShoppingCartIcon className="mr-1" />
          <p>Carrinho</p>
          {cart.length > 0 && (
            <div className="absolute size-3 bg-red-600 rounded-full -right-1 -top-1" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 my-3">
          {cart.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between items-center text-xs">
          <div>Subtotal:</div>
          <div>{moneyFormatter.format(subtotal)}</div>
        </div>

        <Separator className="my-4" />

        <div className="text-center">
          <Button
            className="w-full"
            disabled={cart.length === 0}
            onClick={() => setCheckoutOpen(true)}
          >
            Finalizar compra
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
