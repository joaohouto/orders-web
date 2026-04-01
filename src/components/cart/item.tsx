import { Cart } from "@/types/cart";
import { CartItemQuantity } from "./item-quantity";
import { moneyFormatter } from "@/lib/utils";

type Props = {
  item: Cart;
};

export const CartItem = ({ item }: Props) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <img
          src={item.product.images[0] || "/placeholder.svg"}
          className="w-16 h-16 rounded-md object-contain bg-muted border"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">
          {item.product.name} — {item.product.variationNames}
        </p>
        {item.product.note && (
          <p className="text-xs opacity-50 mt-0.5">{item.product.note}</p>
        )}
        <p className="text-xs opacity-50 mt-0.5">
          {moneyFormatter.format(item.product.price)}
        </p>
        <div className="mt-2">
          <CartItemQuantity cartItem={item} />
        </div>
      </div>
    </div>
  );
};
