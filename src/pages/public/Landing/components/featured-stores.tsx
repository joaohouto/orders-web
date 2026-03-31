import api from "@/services/api";
import { StoreCard } from "./store-card";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Bird } from "lucide-react";
import { info } from "@/config/app";
import { Skeleton } from "@/components/ui/skeleton";

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
    <section className="w-full">
      {/* Hero */}
      {/* Hero */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 flex flex-col items-center justify-center text-center gap-6">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground border rounded-full px-3 py-1">
            <Bird className="h-4 w-4" />
            <span className="tracking-tight">{info.appName}</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-balance max-w-2xl text-primary">
            Compre e venda na sua universidade
          </h1>
          <p className="max-w-[520px] text-muted-foreground text-lg leading-relaxed">
            Conectamos estudantes às melhores lojas do campus. Produtos,
            serviços e promoções exclusivas para a sua universidade.
          </p>
        </div>
      </div>

      {/* Stores grid with grid texture */}
      <div className="relative overflow-hidden">
        {/* Grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 1px)",
              "linear-gradient(90deg, color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: "40px 40px",
          }}
        />
        {/* Radial vignette — fades grid out toward edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, var(--muted) 75%)",
          }}
        />

        <div className="relative container mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="text-xs uppercase text-muted-foreground tracking-widest text-center mb-10">
            Lojas em destaque
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {stores
              ?.filter((store: any) => store.slug === "direitoaquidauana")
              .map((store: any) => (
                <StoreCard key={store.id} {...store} />
              ))}

            {isLoading && (
              <>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[72px] w-[220px] rounded-xl" />
                ))}
              </>
            )}
            {isError && (
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <AlertTriangle className="size-4" /> Não foi possível carregar as lojas
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
