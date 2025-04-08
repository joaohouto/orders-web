import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { AlertCircleIcon, PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateStoreButton } from "./components/create-store-dialog";

export function AppPage() {
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

  return (
    <div className="min-h-screen bg-muted">
      <div className="w-full md:max-w-[400px] mx-auto my-auto flex flex-col gap-4 px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Suas lojas</h2>
        <div className="space-y-4">
          {stores?.map((store: any) => (
            <Link
              key={store.id}
              to={`/app/${store.slug}`}
              className="flex bg-background items-center p-3 rounded-lg border hover:border-primary transition-colors"
            >
              <img
                src={store.icon}
                alt={store.name}
                className="object-cover w-12 h-12 rounded-md overflow-hidden mr-3 bg-muted border"
              />
              <span className="font-medium">{store.name}</span>
            </Link>
          ))}

          {isLoading && (
            <div className="space-y-5">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <AlertCircleIcon />
              <span>Erro ao buscar dados</span>
            </div>
          )}

          <CreateStoreButton onCreateStore={() => alert("opa")} />
        </div>
      </div>
    </div>
  );
}
