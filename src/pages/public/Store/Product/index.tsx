import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { moneyFormatter } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("#7f1d1d");
  const [selectedSize, setSelectedSize] = useState("m");
  const [currentImage, setCurrentImage] = useState(0);

  const product = {
    id: "asdsoidasdsa",
    name: "Moletom",
    price: 120,
    description:
      "PRAZO DE PRODUÇÃO: ✓ Aprox. 30 dias úteis. MATERIAL: ✓ Moletom peluciado: 50% Algodão 50% Poliéster.",
    images: [
      "https://www.cataventouniformes.com.br/wp-content/uploads/2022/02/Moletom-Verde-Musgo-Atletica-Bagres.jpg",
      "https://www.cataventouniformes.com.br/wp-content/uploads/2022/02/Moletom-Azul-Claro-de-Administracao.jpg",
      "https://www.cataventouniformes.com.br/wp-content/uploads/2022/02/Moletom-Verde-Bandeira-Atletica-Unificada-Puc-Pocos-de-Caldas.jpg",
      "https://www.cataventouniformes.com.br/wp-content/uploads/2022/02/Moletom-Terceirao-Absolutos-2020.jpg",
    ],
    colors: [{ name: "Vinho", value: "#7f1d1d" }],
    sizes: [
      { name: "S", value: "s" },
      { name: "M", value: "m" },
      { name: "L", value: "l" },
      { name: "XL", value: "xl" },
    ],
  };

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
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
      },
      quantity
    );
    toast.success("Feito", {
      description: `${product.name} foi adicionado ao carrinho!`,
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Header />

      <div className="w-full lg:w-[1000px] flex flex-col px-8 py-12 gap-4">
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
                className="object-cover"
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
              {product.images.map((image, index) => (
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
              {moneyFormatter.format(product.price)}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium">Cor</h3>
              <div className="mt-2 flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color.value}
                    className={`relative h-8 w-8 rounded-full border ${
                      selectedColor === color.value
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.value)}
                    title={color.name}
                  >
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium">Tamanho</h3>
                <Link
                  href="#"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Guia de tamanhos
                </Link>
              </div>

              <div className="mt-2 flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.value}
                    className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium ${
                      selectedSize === size.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setSelectedSize(size.value)}
                  >
                    {size.name}
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
