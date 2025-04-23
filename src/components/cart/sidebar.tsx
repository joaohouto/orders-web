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
import { useNavigate } from "react-router";
import { useIsMobile } from "@/hooks/use-mobile";

export const CartSidebar = () => {
  const navigate = useNavigate();

  const { cart } = useCartStore((state) => state);
  const isMobile = useIsMobile();

  let subtotal = 0;
  for (const item of cart) {
    subtotal += item.quantity * +item.product.price;
  }

  let items = 0;
  for (const item of cart) {
    items += item.quantity;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="relative"
          variant="outline"
          size={isMobile ? "icon" : "default"}
        >
          <ShoppingCartIcon className="mr-1" />
          <p className="hidden md:flex gap-1 items-center">
            Carrinho <span className="text-xs">({items})</span>
          </p>
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
            <Button
              className="w-full"
              disabled={cart.length === 0}
              onClick={() => navigate("/checkout")}
            >
              Finalizar compra
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
