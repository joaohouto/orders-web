import { Cart } from "@/types/cart";
import { CartItemQuantity } from "./item-quantity";
import { moneyFormatter } from "@/lib/utils";

type Props = {
  item: Cart;
};

export const CartItem = ({ item }: Props) => {
  return (
    <div className="flex items-center gap-5">
      <div className="w-16 overflow-hidden">
        <img
          src={item.product.images[0] || "/placeholder.svg"}
          className="w-16 h-16 rounded-md object-contain bg-muted border"
        />
      </div>
      <div className="flex-1">
        <p className="text-md">
          {item.product.name} - {item.product.variationName}
        </p>

        {item.product.note && (
          <p className="text-xs opacity-50">{item.product.note}</p>
        )}
        <p className="text-xs opacity-50">
          {moneyFormatter.format(+item.product.price)}
        </p>
      </div>
      <div>
        <CartItemQuantity cartItem={item} />
      </div>
    </div>
  );
};
