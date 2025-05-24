import api from "@/services/api";
import { StoreCard } from "./store-card";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Bird, Loader2 } from "lucide-react";
import { info } from "@/config/app";

export function FeaturedStores() {
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
    <section className="w-full py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="flex items-center gap-2 text-xl font-bold text-primary">
            <Bird className="h-6 w-6" />
            <span className="tracking-tighter">{info.appName}</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none text-balance">
            Compre e venda na sua universidade
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl text-balance">
            O vendeuu conecta estudantes universitários com as melhores lojas do
            campus. Encontre produtos, serviços e promoções exclusivas.
          </p>

          <span className="text-sm uppercase text-muted-foreground tracking-wide text-center mt-12 mb-4">
            Lojas em destaque
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          {stores?.map((store: any) => (
            <StoreCard key={store.id} {...store} />
          ))}

          {isLoading && <Loader2 className="animate-spin" />}
          {isError && (
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <AlertTriangle className="size-5" /> Nada encontrado
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
