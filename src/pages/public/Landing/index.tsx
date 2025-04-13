import { Skeleton } from "@/components/ui/skeleton";
import { info } from "@/config/app";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, GalleryVerticalEnd } from "lucide-react";
import { Link } from "react-router";

export function LandingPage() {
  const {
    data: stores,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  });

  async function getStores() {
    const res = await api.get("/stores");
    return res.data;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            {stores?.map((store: any) => (
              <Link
                key={store.id}
                to={`/${store.slug}`}
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
          </div>
        </div>
      </div>
    </div>
  );
}
