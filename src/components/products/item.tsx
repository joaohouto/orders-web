import { Product } from "@/types/product";
import { moneyFormatter } from "@/lib/utils";
import { Link, useParams } from "react-router";

type Props = {
  item: Product;
};

export const ProductItem = ({ item }: Props) => {
  const { storeSlug } = useParams();

  return (
    <Link to={`/${storeSlug}/p/${item.slug}`}>
      <div className="rounded-md overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-32 object-contain bg-muted"
        />
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <p className="text-lg leading-[120%]">{item.name}</p>
        <p className="text-sm opacity-50">
          {moneyFormatter.format(item.price)}
        </p>
      </div>
    </Link>
  );
};
