import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Search, Trash2 } from "lucide-react";

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/phone-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import api from "@/services/api";
import { moneyFormatter } from "@/lib/utils";
import { Product } from "@/types/product";

const buyerSchema = z.object({
  buyerName: z.string().min(1, "Obrigatório"),
  buyerPhone: z
    .string()
    .min(14, "Número incompleto")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
  buyerEmail: z.string().email("Email inválido").or(z.literal("")).optional(),
});

type BuyerFormValues = z.infer<typeof buyerSchema>;

type SelectedItem = {
  productId: string;
  variationIds: string[];
  quantity: number;
  note: string;
  productName: string;
  productImage: string;
  variationNames: string;
  unitPrice: number;
};

export function NewSalePage() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState<SelectedItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string>
  >({});
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemNote, setItemNote] = useState("");

  const form = useForm<BuyerFormValues>({
    resolver: zodResolver(buyerSchema),
    defaultValues: { buyerName: "", buyerPhone: "", buyerEmail: "" },
  });

  const { data: productsData } = useQuery({
    queryKey: ["products-for-sale", storeSlug, search],
    queryFn: async () => {
      const response = await api.get(`/stores/${storeSlug}/products`, {
        params: {
          page: "1",
          limit: "50",
          ...(search ? { q: search } : {}),
        },
      });
      return response.data;
    },
    enabled: pickerOpen && !selectedProduct,
  });

  const products: Product[] = productsData?.data ?? [];

  function openPicker() {
    setSearch("");
    setSelectedProduct(null);
    setSelectedVariations({});
    setItemQuantity(1);
    setItemNote("");
    setPickerOpen(true);
  }

  function selectProduct(product: Product) {
    setSelectedProduct(product);
    setSelectedVariations({});
    setItemQuantity(1);
    setItemNote("");
  }

  function addItem() {
    if (!selectedProduct) return;

    for (const group of selectedProduct.variationGroups) {
      if (!selectedVariations[group.id]) {
        toast.error(`Selecione uma opção para "${group.name}"`);
        return;
      }
    }

    const variationIds = Object.values(selectedVariations);

    const variationNames = selectedProduct.variationGroups
      .map((group) => {
        const variation = group.variations.find(
          (v) => v.id === selectedVariations[group.id]
        );
        return variation ? `${group.name}: ${variation.name}` : "";
      })
      .filter(Boolean)
      .join(" / ");

    let unitPrice = Number(selectedProduct.price);
    for (const vId of variationIds) {
      for (const group of selectedProduct.variationGroups) {
        const variation = group.variations.find((v) => v.id === vId);
        if (variation) unitPrice += Number(variation.priceAdjustment);
      }
    }

    setItems((prev) => [
      ...prev,
      {
        productId: selectedProduct.id,
        variationIds,
        quantity: itemQuantity,
        note: itemNote,
        productName: selectedProduct.name,
        productImage: selectedProduct.images[0] ?? "",
        variationNames,
        unitPrice,
      },
    ]);

    setPickerOpen(false);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(values: BuyerFormValues) {
    if (items.length === 0) {
      toast.error("Adicione pelo menos um produto");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(`/stores/${storeSlug}/orders/guest`, {
        buyerName: values.buyerName,
        buyerPhone: values.buyerPhone.replace(/\D/g, ""),
        ...(values.buyerEmail ? { buyerEmail: values.buyerEmail } : {}),
        items: items.map((item) => ({
          productId: item.productId,
          variationIds: item.variationIds,
          quantity: item.quantity,
          ...(item.note ? { note: item.note } : {}),
        })),
      });

      toast.success(`Pedido #${response.data.code} criado!`);
      navigate(`/app/${storeSlug}/orders/v/${response.data.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Erro ao criar pedido";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const total = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <>
      <AppHeader
        routes={[
          { path: "orders", title: "Pedidos" },
          { path: "orders/new", title: "Nova Venda" },
        ]}
      />

      <div className="w-full md:max-w-[600px] mx-auto p-4 md:p-8 flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Dados do comprador</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="buyerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Maria Silva" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buyerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <PhoneInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buyerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email{" "}
                        <span className="text-muted-foreground font-normal">
                          (opcional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="maria@email.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Produtos</CardTitle>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={openPicker}
                >
                  <Plus className="size-4" />
                  Adicionar
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum produto adicionado
                  </p>
                ) : (
                  items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start text-sm">
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="size-12 shrink-0 rounded-md border bg-muted object-contain"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">
                          {item.quantity}x {item.productName}
                        </p>
                        {item.variationNames && (
                          <p className="text-muted-foreground text-xs">
                            {item.variationNames}
                          </p>
                        )}
                        {item.note && (
                          <p className="text-xs italic text-muted-foreground">
                            {item.note}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 font-medium">
                        {moneyFormatter.format(item.unitPrice * item.quantity)}
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))
                )}

                {items.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{moneyFormatter.format(total)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Button type="submit" size="lg" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              Criar pedido
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? selectedProduct.name : "Selecionar produto"}
            </DialogTitle>
          </DialogHeader>

          {!selectedProduct ? (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Buscar produto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-1 min-h-0">
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="flex gap-3 items-center p-2 rounded-lg hover:bg-muted text-left w-full"
                    onClick={() => selectProduct(product)}
                  >
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="size-10 rounded-md border bg-muted object-contain shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {moneyFormatter.format(Number(product.price))}
                      </p>
                    </div>
                  </button>
                ))}
                {products.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum produto encontrado
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 min-h-0">
              {selectedProduct.variationGroups.map((group) => (
                <div key={group.id} className="flex flex-col gap-2">
                  <Label className="font-semibold">{group.name}</Label>
                  <RadioGroup
                    value={selectedVariations[group.id] ?? ""}
                    onValueChange={(value) =>
                      setSelectedVariations((prev) => ({
                        ...prev,
                        [group.id]: value,
                      }))
                    }
                    className="flex flex-col gap-1"
                  >
                    {group.variations.map((variation) => (
                      <div
                        key={variation.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
                      >
                        <RadioGroupItem
                          value={variation.id}
                          id={variation.id}
                        />
                        <Label
                          htmlFor={variation.id}
                          className="flex-1 cursor-pointer flex justify-between"
                        >
                          <span>{variation.name}</span>
                          {Number(variation.priceAdjustment) !== 0 && (
                            <span className="text-muted-foreground text-xs">
                              {Number(variation.priceAdjustment) > 0 ? "+" : ""}
                              {moneyFormatter.format(Number(variation.priceAdjustment))}
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <Label>Quantidade</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="size-8"
                    onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {itemQuantity}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="size-8"
                    onClick={() => setItemQuantity((q) => q + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {selectedProduct.acceptOrderNote && (
                <div className="flex flex-col gap-2">
                  <Label>
                    Observação{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </Label>
                  <Input
                    value={itemNote}
                    onChange={(e) => setItemNote(e.target.value)}
                    placeholder="Ex: sem cebola..."
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            {selectedProduct ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedProduct(null)}
                >
                  Voltar
                </Button>
                <Button type="button" onClick={addItem} className="flex-1">
                  Adicionar ao pedido
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setPickerOpen(false)}
              >
                Cancelar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
