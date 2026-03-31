import { SiteFooter } from "@/components/footer";
import { Header } from "@/components/header";
import { ErrorPage } from "@/components/page-error";
import { ProductItem } from "@/components/products/item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { InstagramIcon, PackageOpen } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router";

export function StorePage() {
  const { storeSlug } = useParams();

  const {
    data: store,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`store-${storeSlug}`],
    queryFn: getStore,
  });

  async function getStore() {
    const res = await api.get(`/stores/${storeSlug}`);
    return res.data;
  }

  const {
    data: products,
    isLoading: loadingProducts,
    isError: errorProducts,
  } = useQuery({
    queryKey: [`store-${storeSlug}-products`],
    queryFn: getStoreProducts,
  });

  async function getStoreProducts() {
    const res = await api.get(`/stores/${storeSlug}/products`);
    return res.data;
  }

  useEffect(() => {
    if (store?.name) {
      document.title = store.name;
    }
    return () => {
      document.title = "vendeuu";
    };
  }, [store?.name]);

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Header />

      <div className="w-full md:w-[720px] flex flex-col py-6 px-4 gap-4 pb-20">
        <section className="mb-8 space-y-4">
          {/* Banner */}
          {isLoading ? (
            <Skeleton className="w-full h-[100px] md:h-[200px] rounded-xl" />
          ) : (
            store.banner && (
              <img
                src={store.banner}
                className="w-full h-[100px] md:h-[200px] rounded-xl border object-cover"
              />
            )
          )}

          {/* Store identity */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Skeleton className="size-[100px] rounded-xl flex-shrink-0" />
            ) : (
              <img
                src={store.icon || "/placeholder.svg"}
                className="size-[100px] rounded-xl border object-cover flex-shrink-0"
              />
            )}
            <div className="space-y-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-7 w-40 rounded-md" />
                  <Skeleton className="h-7 w-28 rounded-full" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {store.name}
                  </h1>
                  {store.instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      asChild
                    >
                      <a
                        href={`https://instagram.com/${store.instagram}`}
                        target="_blank"
                      >
                        <InstagramIcon />
                        {store.instagram}
                      </a>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        <div>
          <h2 className="text-sm uppercase font-medium mb-4 text-muted-foreground">
            Produtos
          </h2>

          {loadingProducts ? (
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full h-32 rounded-md" />
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/3 rounded" />
                </div>
              ))}
            </div>
          ) : products?.data?.length > 0 ? (
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {products.data.map((product: any) => (
                <ProductItem key={product.id} item={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <PackageOpen className="size-10 stroke-1" />
              <p className="text-sm font-medium">Nenhum produto disponível</p>
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
