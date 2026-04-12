import api from "@/services/api";
import { StoreCard } from "./store-card";
import { FAQ } from "./faq";
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
      {/* Hero + Stores merged */}
      <div className="relative overflow-hidden border-b">
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
        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, var(--background) 75%)",
          }}
        />

        <div className="relative container mx-auto px-4 md:px-6 pt-24 pb-16 md:pt-36 md:pb-24 flex flex-col items-center gap-12">
          {/* Text block */}
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground border rounded-full px-3 py-1 bg-background/60 backdrop-blur-sm">
              <Bird className="size-3.5" />
              <span className="tracking-tight">{info.appName}</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-balance max-w-2xl text-primary">
              Compre e venda na sua universidade
            </h1>

            <p className="max-w-[560px] text-muted-foreground text-lg leading-relaxed">
              Conectamos estudantes às melhores lojas do campus. Produtos,
              serviços e promoções exclusivas para a sua universidade.
            </p>
          </div>

          {/* Stores block */}
          <div className="flex flex-col items-center gap-5 w-full">
            <p className="text-xs uppercase text-muted-foreground tracking-widest">
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
                    <Skeleton
                      key={i}
                      className="h-[72px] w-[220px] rounded-xl"
                    />
                  ))}
                </>
              )}
              {isError && (
                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                  <AlertTriangle className="size-4" /> Não foi possível carregar
                  as lojas
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <FAQ />
    </section>
  );
}
