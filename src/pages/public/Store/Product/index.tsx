import { Header } from "@/components/header";
import { ErrorPage } from "@/components/page-error";
import { LoadingPage } from "@/components/page-loading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { moneyFormatter } from "@/lib/utils";
import api from "@/services/api";
import { useCartStore } from "@/stores/cart-store";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

export function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  const [selectedVariation, setSelectedVariation] = useState();
  const [note, setNote] = useState("");

  const { storeSlug, productSlug } = useParams();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`store-${storeSlug}-product-${productSlug}`],
    queryFn: getProduct,
  });

  async function getProduct() {
    const res = await api.get(`/stores/${storeSlug}/products/${productSlug}`);

    setSelectedVariation(res.data.variations[0]);
    return res.data;
  }

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (currentImage - 1 + product.images.length) % product.images.length
    );
  };

  const { upsertCartItem } = useCartStore((state) => state);

  const handleAddButton = () => {
    upsertCartItem(
      {
        id: selectedVariation.id,
        storeId: product.storeId,
        productId: product.id,
        name: product.name,
        images: product.images,
        variationName: selectedVariation.name,
        price: selectedVariation.price,
        note,
      },
      quantity
    );
    toast.success("Feito", {
      description: `${product.name} foi adicionado ao carrinho!`,
      duration: 2000,
    });
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Header />

      <div className="w-full lg:w-[1000px] flex flex-col px-8 py-12 gap-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/${storeSlug}`}>{product.store.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background text-foreground"
                onClick={prevImage}
              >
                <ChevronLeft />
                <span className="sr-only">Previous image</span>
              </Button>
              <img
                src={product.images[currentImage] || "/placeholder.svg"}
                alt={product.name}
                className="object-cover w-full"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background text-foreground"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>
            <div className="flex space-x-2 overflow-auto pb-2">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  className={`relative size-18 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                    currentImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setCurrentImage(index)}
                >
                  <img
                    src={image}
                    alt={product.name}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>

            <div className="text-3xl font-bold">
              {moneyFormatter.format(selectedVariation?.price)}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-medium">Variações</h3>

              <div className="mt-2 flex gap-2">
                {product.variations?.map((variation: any) => (
                  <button
                    key={variation.id}
                    className={`flex h-10 min-w-10 px-3 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                      selectedVariation?.id === variation.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setSelectedVariation(variation)}
                  >
                    {variation.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium">Quantidade</h3>
              <div className="mt-2 flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                >
                  <Minus />
                  <span className="sr-only">Diminiuir quantidade</span>
                </Button>
                <span className="w-6 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                >
                  <Plus />
                  <span className="sr-only">Aumentar quantidade</span>
                </Button>
              </div>
            </div>

            {product.acceptOrderNote && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Alguma observação?</h3>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex.: escreva 'João' nas costas e adicione o número '03' "
                />
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex space-x-2">
              <Button onClick={handleAddButton} className="w-full" size="lg">
                <ShoppingCart />
                Adicionar ao carrinho
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
