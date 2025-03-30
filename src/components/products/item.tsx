"use client";

import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { moneyFormatter } from "@/lib/utils";

type Props = {
  item: Product;
};

export const ProductItem = ({ item }: Props) => {
  const { upsertCartItem } = useCartStore((state) => state);

  const handleAddButton = () => {
    upsertCartItem(item, 1);
    toast.success("Feito", {
      description: `${item.name} foi adicionado ao carrinho!`,
      duration: 2000,
    });
  };

  return (
    <div>
      <div className="rounded-md overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-32 object-contain bg-muted"
        />
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <p className="text-lg">{item.name}</p>
        <p className="text-sm opacity-50">
          {moneyFormatter.format(item.price)}
        </p>
        <Button variant="outline" onClick={handleAddButton}>
          Adicionar
        </Button>
      </div>
    </div>
  );
};
