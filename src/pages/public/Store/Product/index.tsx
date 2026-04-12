import { isPast } from "date-fns";
import { Header } from "@/components/header";
import { ErrorPage } from "@/components/page-error";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { moneyFormatter } from "@/lib/utils";
import api from "@/services/api";
import { useCartStore } from "@/stores/cart-store";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  PackageX,
  Plus,
  ShoppingCart,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import { SiteFooter } from "@/components/footer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedByGroup, setSelectedByGroup] = useState<
    Record<string, string>
  >({});
  const [note, setNote] = useState("");
  const [selectionError, setSelectionError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { storeSlug, productSlug } = useParams();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [`store-${storeSlug}-product-${productSlug}`],
    queryFn: getProduct,
  });

  const isNotFound = isError && (error as any)?.response?.status === 404;

  async function getProduct() {
    const res = await api.get(`/stores/${storeSlug}/products/${productSlug}`);
    return res.data;
  }

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (currentImage - 1 + product.images.length) % product.images.length,
    );
  };

  const { upsertCartItem } = useCartStore((state) => state);

  // Derived values (only valid when product is loaded)
  const isSoldOut =
    !!product?.soldOutAt && isPast(new Date(product.soldOutAt));
  const groups: any[] = product?.variationGroups ?? [];
  const allSelected = groups.every((g: any) => selectedByGroup[g.id]);

  const totalPriceAdjustment = groups.reduce((sum: number, g: any) => {
    const selectedId = selectedByGroup[g.id];
    if (!selectedId) return sum;
    const v = g.variations.find((v: any) => v.id === selectedId);
    return sum + Number(v?.priceAdjustment || 0);
  }, 0);

  const displayPrice = product
    ? Number(product.price) + totalPriceAdjustment
    : 0;

  const handleAddButton = () => {
    if (!allSelected) {
      setSelectionError(true);
      setTimeout(() => setSelectionError(false), 2000);
      return;
    }

    const variationIds = Object.values(selectedByGroup);
    const cartKey = `${product.id}:${[...variationIds].sort().join(",")}`;
    const variationNames = groups
      .filter((g: any) => selectedByGroup[g.id])
      .map((g: any) => {
        const v = g.variations.find((v: any) => v.id === selectedByGroup[g.id]);
        return v.name;
      })
      .join(" / ");

    upsertCartItem(
      {
        cartKey,
        storeId: product.storeId,
        productId: product.id,
        name: product.name,
        images: product.images,
        variationIds,
        variationNames,
        price: displayPrice,
        note,
      },
      quantity,
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  if (isNotFound) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-4 py-20">
          <div className="rounded-full bg-muted p-6">
            <PackageX className="size-10 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Produto não encontrado</h2>
            <p className="text-muted-foreground text-sm">
              Este produto não existe ou foi removido da loja.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to={`/${storeSlug}`}>Voltar para a loja</Link>
          </Button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Header />
        <div className="w-full lg:w-[1000px] flex flex-col px-4 py-8 gap-4 mb-20">
          <Skeleton className="h-4 w-48 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="size-16 rounded-md flex-shrink-0"
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <Skeleton className="h-9 w-3/4 rounded-md" />
              <Skeleton className="h-8 w-1/3 rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded" />
                <div className="flex gap-2">
                  <Skeleton className="size-9 rounded-md" />
                  <Skeleton className="w-8 h-9 rounded" />
                  <Skeleton className="size-9 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Header />

      <div className="w-full lg:w-[1000px] flex flex-col px-4 py-8 gap-4 mb-20 md:mb-20 pb-20 md:pb-0">
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
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-[#F4F4F5] group">
              {product.images?.length > 1 && (
                <Button
                  size="icon"
                  className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background text-foreground shadow-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft />
                  <span className="sr-only">Imagem anterior</span>
                </Button>
              )}

              <button
                className="w-full h-full block relative"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={product.images[currentImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="object-contain w-full h-full"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 ease-out bg-black/50 p-3 rounded-full">
                    <ZoomIn className="size-6 text-white/75" />
                  </div>
                </div>
              </button>

              {product.images?.length > 1 && (
                <Button
                  size="icon"
                  className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background text-foreground shadow-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Próxima imagem</span>
                </Button>
              )}
            </div>

            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
              <DialogContent className="max-w-5xl w-[95vw] p-2 bg-background/98 backdrop-blur-md">
                <DialogTitle className="sr-only">{product.name}</DialogTitle>
                <div className="relative">
                  <img
                    src={product.images[currentImage] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full max-h-[88vh] object-contain rounded-lg bg-[#F4F4F5]"
                  />
                  {product.images?.length > 1 && (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={prevImage}
                      >
                        <ChevronLeft />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={nextImage}
                      >
                        <ChevronRight />
                      </Button>
                    </>
                  )}
                </div>
                {product.images?.length > 1 && (
                  <div className="flex gap-2 justify-center pt-1 pb-3">
                    {product.images.map((_: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`size-2 rounded-full transition-colors ${i === currentImage ? "bg-foreground" : "bg-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <ScrollArea className="w-full" orientation="horizontal">
              <div className="flex space-x-2 pb-2 w-max">
                {product.images?.map((image: string, index: number) => (
                  <button
                    key={index}
                    className={`relative size-20 flex-shrink-0 overflow-hidden rounded-md border-2 bg-muted ${
                      currentImage === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentImage(index)}
                  >
                    <img
                      src={image}
                      alt={product.name}
                      className="object-cover bg-[#F4F4F5]"
                    />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight">
              {product.name}
            </h1>

            <div className="text-2xl font-bold text-foreground opacity-50">
              {moneyFormatter.format(displayPrice)}
            </div>

            <p className="prose prose-neutral dark:prose-invert">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </p>

            <Separator />

            {/* Variation selectors grouped by variationGroup */}
            <div className="flex flex-col gap-5">
              {selectionError && (
                <span className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-right-2">
                  Selecione todas as variações
                </span>
              )}

              {groups.map((group: any) => (
                <div key={group.id}>
                  <h3
                    className={`text-sm font-medium mb-2 ${selectionError && !selectedByGroup[group.id] ? "text-destructive" : ""}`}
                  >
                    {group.name}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {group.variations.map((variation: any) => {
                      const isSelected =
                        selectedByGroup[group.id] === variation.id;
                      return (
                        <button
                          key={variation.id}
                          type="button"
                          onClick={() => {
                            setSelectedByGroup((prev) => ({
                              ...prev,
                              [group.id]: variation.id,
                            }));
                            setSelectionError(false);
                          }}
                          className={`px-3 py-1.5 min-w-10 rounded-md border text-sm font-medium transition-all ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : selectionError && !selectedByGroup[group.id]
                                ? "border-destructive/60 hover:border-destructive"
                                : "border-border hover:border-foreground/40"
                          }`}
                        >
                          {variation.name}
                          {Number(variation.priceAdjustment) !== 0 && (
                            <span
                              className={`ml-1.5 text-xs ${isSelected ? "opacity-80" : "text-muted-foreground"}`}
                            >
                              {Number(variation.priceAdjustment) > 0 ? "+" : ""}
                              {moneyFormatter.format(
                                Number(variation.priceAdjustment),
                              )}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
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
                  <span className="sr-only">Diminuir quantidade</span>
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
              {isSoldOut ? (
                <Button
                  className="w-full"
                  size="lg"
                  disabled
                  variant="outline"
                >
                  Produto esgotado
                </Button>
              ) : (
                <Button
                  onClick={handleAddButton}
                  className="w-full transition-all"
                  size="lg"
                  disabled={addedToCart}
                >
                  {addedToCart ? (
                    <>
                      <Check className="animate-in zoom-in-50 duration-200" />
                      Adicionado!
                    </>
                  ) : (
                    <>
                      <ShoppingCart />
                      Adicionar ao carrinho
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
