import { Link, useParams } from "react-router";

import { Product } from "@/types/product";
import { moneyFormatter } from "@/lib/utils";
import Decimal from "decimal.js";

type Props = {
  item: Product;
};

export const ProductItem = ({ item }: Props) => {
  const { storeSlug } = useParams();

  const num = new Decimal(item.variations[0].price);

  return (
    <Link to={`/${storeSlug}/p/${item.slug}`}>
      <div className="rounded-md overflow-hidden">
        <img
          src={item.images[0] || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-32 object-contain"
        />
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <p className="text-lg leading-[120%]">{item.name}</p>
        <p className="text-sm opacity-50">
          {moneyFormatter.format(num.toNumber())}
        </p>
      </div>
    </Link>
  );
};
