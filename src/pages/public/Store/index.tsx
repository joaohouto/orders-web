import { SiteFooter } from "@/components/footer";
import { Header } from "@/components/header";
import { ErrorPage } from "@/components/page-error";
import { LoadingPage } from "@/components/page-loading";
import { ProductItem } from "@/components/products/item";
import { Button } from "@/components/ui/button";
import { info } from "@/config/app";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { InstagramIcon } from "lucide-react";
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

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Header />

      <div className="w-full md:w-[720px] flex flex-col py-8 px-4 gap-4 pb-20">
        <section className="mb-8 space-y-4">
          {store.banner && (
            <img
              src={store.banner}
              className="w-full h-[200px] bg-muted rounded-xl border object-cover"
            />
          )}

          <div className="flex items-center gap-4">
            <img
              src={store.icon || "/placeholder.svg"}
              className="size-[100px] bg-muted rounded-xl border object-cover"
            />
            <div className="space-y-2">
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
            </div>
          </div>
        </section>

        <div>
          <h2 className="text-sm uppercase font-medium mb-4 text-muted-foreground">
            Produtos
          </h2>
          {products?.data?.length > 0 && (
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {products?.data?.map((product: any) => (
                <ProductItem key={product.id} item={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
