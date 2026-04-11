import { Link, useNavigate } from "react-router";

import { AlertCircleIcon, ChevronRight, Loader2, Store } from "lucide-react";
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
    <div className="min-h-screen flex justify-center items-start md:items-center">
      <div className="w-full md:max-w-[420px] mx-auto flex flex-col gap-6 px-4 py-12">
        <div className="flex items-center gap-2 text-foreground">
          <info.appIcon className="size-5 text-primary" />
          <span className="font-semibold tracking-tight">{info.appName}</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suas lojas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Selecione uma loja para gerenciá-la
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {stores?.map((store: any) => (
            <Link
              key={store.id}
              to={`/app/${store.slug}`}
              className="flex items-center gap-4 p-4 rounded-xl border bg-background hover:border-primary hover:shadow-sm transition-all duration-150 group"
            >
              <img
                src={store.icon || "./placeholder.svg"}
                alt={store.name}
                className="object-cover w-11 h-11 rounded-lg bg-muted border flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium leading-tight">{store.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  /{store.slug}
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
            </Link>
          ))}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground text-sm">
              <AlertCircleIcon className="size-5" />
              <span>Não foi possível carregar suas lojas</span>
            </div>
          )}

          {!isLoading && !isError && stores?.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                <Store className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Você ainda não tem lojas. Crie sua primeira!
              </p>
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
