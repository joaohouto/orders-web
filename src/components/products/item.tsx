import { Link, useParams } from "react-router";
import { isPast } from "date-fns";

import { Product } from "@/types/product";
import { moneyFormatter } from "@/lib/utils";

type Props = {
  item: Product;
};

export const ProductItem = ({ item }: Props) => {
  const { storeSlug } = useParams();
  const isSoldOut = !!item.soldOutAt && isPast(new Date(item.soldOutAt));

  return (
    <Link to={`/${storeSlug}/p/${item.slug}`}>
      <div className="rounded-md overflow-hidden relative">
        <img
          src={item.images[0] || "/placeholder.svg"}
          alt={item.name}
          className={`w-full h-32 object-contain${isSoldOut ? " opacity-50" : ""}`}
        />
        {isSoldOut && (
          <span className="absolute top-1 left-1 bg-foreground/80 backdrop-blur-sm text-background text-xs font-medium px-2 py-0.5 rounded-full">
            Esgotado
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <p
          className={`text-lg leading-[120%]${isSoldOut ? " opacity-50" : ""}`}
        >
          {item.name}
        </p>
        <p className="text-sm opacity-50">
          {moneyFormatter.format(Number(item.price))}
        </p>
      </div>
    </Link>
  );
};
