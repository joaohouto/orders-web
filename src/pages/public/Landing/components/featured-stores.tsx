import api from "@/services/api";
import { StoreCard } from "./store-card";
import { useQuery } from "@tanstack/react-query";

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
    <section className="w-full py-12 md:py-24 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none ">
            Compre e venda na sua universidade
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            O vendeuu conecta estudantes universitários com as melhores lojas do
            campus. Encontre produtos, serviços e promoções exclusivas.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          {stores?.map((store: any) => (
            <StoreCard key={store.id} {...store} />
          ))}
        </div>
      </div>
    </section>
  );
}
