import { Link, useNavigate } from "react-router";

import { AlertCircleIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { CreateStoreButton } from "./components/create-store-dialog";
import { info } from "@/config/app";

export function AppPage() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-muted flex justify-center items-center">
      <div className="w-full md:max-w-[400px] mx-auto my-auto flex flex-col gap-2 px-4 py-8">
        <info.appIcon className="text-primary" />

        <h2 className="text-xl font-semibold mb-4">Suas lojas</h2>
        <div className="space-y-4">
          {stores?.map((store: any) => (
            <Link
              key={store.id}
              to={`/app/${store.slug}`}
              className="flex bg-background items-center p-3 rounded-lg border hover:border-primary transition-colors"
            >
              <img
                src={store.icon || "./placeholder.svg"}
                alt={store.name}
                className="object-cover w-12 h-12 rounded-md overflow-hidden mr-3 bg-muted border"
              />
              <span className="font-medium">{store.name}</span>
            </Link>
          ))}

          {isLoading && (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <AlertCircleIcon />
              <span>Erro ao buscar dados</span>
            </div>
          )}

          {stores?.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <AlertCircleIcon />
              <span>Nenhuma loja aqui</span>
            </div>
          )}

          <CreateStoreButton
            onCreateStore={(createdStoreSlug: string) =>
              navigate(`/app/${createdStoreSlug}`)
            }
          />
        </div>
      </div>
    </div>
  );
}
