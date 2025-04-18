import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { Link, useParams } from "react-router";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";

export function StoreSelector({
  onChangeCurrentStore,
}: {
  onChangeCurrentStore?: (store: any) => any;
}) {
  const { storeSlug } = useParams();
  const [currentStore, setCurrentStore] = useState({
    id: "",
    icon: "",
    name: "",
    slug: "",
  });

  const {
    data: stores,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userStores"],
    queryFn: getUserStores,
  });

  async function getUserStores() {
    const res = await api.get("/stores/mine");
    return res.data;
  }

  useEffect(() => {
    if (stores) {
      const currentStore = stores.filter((s: any) => s.slug === storeSlug)[0];

      setCurrentStore(currentStore);
      onChangeCurrentStore?.(currentStore);
    }
  }, [stores, storeSlug]);

  if (isLoading) {
    return <span>...</span>;
  }

  if (isError) {
    return <span>Erro</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {currentStore && (
          <>
            <img
              src={currentStore.icon || "/placeholder.svg"}
              alt={currentStore.name}
              className="object-cover rounded-md size-8 border bg-muted"
            />

            <div className="flex flex-col text-left">
              <span className="font-medium">{currentStore.name}</span>
              <span className="text-xs text-muted-foreground">
                {currentStore.slug}
              </span>
            </div>
          </>
        )}
        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {stores.map((store: any) => (
            <DropdownMenuItem
              key={store.id}
              className="flex items-center gap-3 py-2"
              asChild
            >
              <Link to={`/app/${store.slug}`}>
                <img
                  src={store.icon || "/placeholder.svg"}
                  alt={store.name}
                  className="object-cover rounded-md bg-muted border size-8"
                />
                <div className="flex flex-col">
                  <span className="font-medium">{store.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {store.slug}
                  </span>
                </div>
                {storeSlug === store.slug && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
