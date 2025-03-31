import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bird, ShoppingCartIcon } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { CartItem } from "./item";
import { moneyFormatter } from "@/lib/utils";
import { Link } from "react-router";

export const CartSidebar = () => {
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

        <div className="p-4">
          <div className="flex flex-col gap-5 my-3">
            {cart.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="size-12 bg-muted text-muted-foreground rounded-xl flex justify-center items-center mb-4">
                <Bird />
              </div>

              <strong>Nada por aqui</strong>
              <span className="text-sm text-muted-foreground">
                Escolha algum produto na loja
              </span>
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex justify-between items-center text-xs">
            <div>Subtotal:</div>
            <div>{moneyFormatter.format(subtotal)}</div>
          </div>

          <Separator className="my-4" />

          <div className="text-center">
            <Button className="w-full" disabled={cart.length === 0} asChild>
              <Link to="/checkout">Finalizar compra</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
