import { Header } from "@/components/header";
import { ProductItem } from "@/components/products/item";
import { Button } from "@/components/ui/button";
import { info } from "@/config/app";
import { InstagramIcon } from "lucide-react";
import { useParams } from "react-router";

export function StorePage() {
  const { storeSlug } = useParams();

  const store = {
    slug: storeSlug,
    name: "Direito Aquidauana",
    instagram: "direitoaquidauana",
    bannerURL: "/banner.png",
    iconURL: "/icon.png",
  };

  const products = [
    {
      id: "saidjsaoidjsa",
      image:
        "https://www.cataventouniformes.com.br/wp-content/uploads/2024/07/Jaqueta-College-Personalizada-preto-com-branco-Bordado.png",
      name: "Jaqueta College",
      price: 120,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <Header />

      <div className="w-full md:w-[720px] flex flex-col p-8 gap-4">
        <section className="mb-8 space-y-4">
          <img
            src={store.bannerURL}
            className="w-full h-[200px] bg-muted rounded-xl border object-cover"
          />

          <div className="flex items-center gap-8">
            <img
              src={store.iconURL}
              className="size-[100px] bg-muted rounded-xl border object-cover"
            />
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {store.name}
              </h1>
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
            </div>
          </div>
        </section>

        <div>
          {products.length > 0 && (
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {products.map((product) => (
                <ProductItem key={product.id} item={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="p-8 text-sm text-muted-foreground">
        {info.appName} não efetua as entregas
      </footer>
    </div>
  );
}
