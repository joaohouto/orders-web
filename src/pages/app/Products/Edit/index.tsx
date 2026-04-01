import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AppHeader } from "@/components/app-header";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CirclePlus,
  CircleXIcon,
  GripVertical,
  Loader2,
  SaveIcon,
  Trash2,
} from "lucide-react";
import { FileUploader } from "@/components/file-uploader";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import MoneyInput from "@/components/money-input";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { LoadingPage } from "@/components/page-loading";
import { ErrorPage } from "@/components/page-error";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

function SortableImageItem({
  fieldId,
  index,
  src,
  form,
  onRemove,
}: {
  fieldId: string;
  index: number;
  src: string;
  form: any;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: fieldId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group w-fit">
      <img
        src={src}
        className="size-[100px] border rounded-md object-contain bg-muted/30"
      />
      <button
        type="button"
        className="absolute inset-0 rounded-md cursor-grab opacity-0 group-hover:opacity-100 bg-black/10 flex items-center justify-center transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-5 text-white drop-shadow-md" />
      </button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="absolute -right-2 -top-2 size-6 p-0 rounded-full bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
      >
        <CircleXIcon className="size-3.5" />
      </Button>
      <FormField
        control={form.control}
        name={`images.${index}`}
        render={({ field: formField }) => (
          <FormItem>
            <FormControl>
              <Input className="hidden" {...formField} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

type VariationFormItem = {
  id: string;
  name: string;
  type: "GENERIC" | "COLOR" | "SIZE" | "FABRIC";
  priceAdjustment: number;
};

function SortableVariationCard({
  field,
  index,
  form,
  onRemove,
}: {
  field: VariationFormItem;
  index: number;
  form: any;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="border border-muted">
      <CardContent className="pt-2 space-y-3">
        <div className="flex items-start gap-2">
          <button
            type="button"
            className="mt-7 cursor-grab touch-none text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
          <div className="grid gap-4 sm:grid-cols-2 flex-1">
            <FormField
              control={form.control}
              name={`variations.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da variante</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Azul" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variations.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {variationTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <MoneyInput
          form={form}
          label="Acréscimo de preço (opcional)"
          name={`variations.${index}.priceAdjustment`}
          placeholder="R$ 0,00"
        />
      </CardContent>
      <CardFooter className="flex justify-end border-t bg-muted/20 p-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        >
          <Trash2 />
          Remover
        </Button>
      </CardFooter>
    </Card>
  );
}

const variationTypes = [
  { value: "GENERIC", label: "Genérico" },
  { value: "COLOR", label: "Cor" },
  { value: "SIZE", label: "Tamanho" },
  { value: "FABRIC", label: "Tecido" },
] as const;

const formSchema = z.object({
  slug: z.string({ message: "Forneça um valor" }),
  name: z.string({ message: "Forneça um valor" }),
  description: z.string({ message: "Forneça um valor" }).optional(),
  price: z.coerce.number({ message: "Informe um preço" }).positive({ message: "Preço deve ser positivo" }),
  isActive: z.boolean().default(true),
  acceptOrderNote: z.boolean().default(false),
  images: z.array(z.string().url()),
  variations: z.array(
    z.object({
      name: z.string({ message: "Informe este campo" }),
      type: z.enum(["GENERIC", "COLOR", "SIZE", "FABRIC"], { message: "Selecione o tipo" }),
      priceAdjustment: z.coerce.number().default(0),
    })
  ),
});

export function EditProductPage() {
  const [loadingAction, setLoadingAction] = useState(false);

  const { storeSlug, productSlug } = useParams();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`product-${productSlug}`],
    queryFn: getProducts,
  });

  async function getProducts() {
    const res = await api.get(`/stores/${storeSlug}/products/${productSlug}`);
    return res.data;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        isActive: product.isActive,
        acceptOrderNote: product.acceptOrderNote,
        images: product.images,
        variations: product.variations.map((v: any) => ({
          name: v.name,
          type: v.type,
          priceAdjustment: Number(v.priceAdjustment ?? 0),
        })),
      });
    }
  }, [product]);

  const variations = useFieldArray({
    control: form.control,
    name: "variations",
  } as never);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = variations.fields.findIndex((f: any) => f.id === active.id);
      const newIndex = variations.fields.findIndex((f: any) => f.id === over.id);
      variations.move(oldIndex, newIndex);
    }
  }

  function handleImageDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.fields.findIndex((f: any) => f.id === active.id);
      const newIndex = images.fields.findIndex((f: any) => f.id === over.id);
      images.move(oldIndex, newIndex);
    }
  }

  function handleAddVariation() {
    const fields = form.getValues("variations") as VariationFormItem[];
    const last = fields[fields.length - 1];
    variations.append(
      last
        ? { name: "", type: last.type, priceAdjustment: last.priceAdjustment }
        : { name: "", type: "GENERIC", priceAdjustment: 0 }
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingAction(true);

    try {
      await api.put(
        `/stores/${storeSlug}/products/${productSlug}`,
        values
      );

      toast.success(`Produto atualizado!`);

      navigate(-1);
    } catch (err) {
      console.log(err);
      toast.error("Erro ao atualizar produto");
    } finally {
      setLoadingAction(false);
    }
  }

  useEffect(() => {
    if (form.watch("name")) {
      form.setValue(
        "slug",
        form.watch("name").toLocaleLowerCase().replaceAll(" ", "-")
      );
    }
  }, [form.watch("name")]);

  const images = useFieldArray({
    control: form.control,
    name: "images",
  } as never);

  async function handleImageUpload(files: File[]) {
    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const response = await api.post(`/files/upload`, formData);

      toast.success("Imagem carregada");

      return response.data;
    } catch (err) {
      console.log(err);
      toast.error("Erro ao carregar arquivo");
    }
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <>
      <AppHeader
        routes={[
          { path: "products", title: "Produtos" },
          { path: "create", title: `Editar ${product.name}` },
        ]}
      />

      <div className="w-full md:max-w-[600px] mx-auto  p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identificador</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Ficará no URL da página.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do produto</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MoneyInput
              form={form}
              label="Preço base"
              name="price"
              placeholder="R$"
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Produto ativo</FormLabel>
                    <FormDescription>
                      Se marcado, o seu produto estará visível na loja
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptOrderNote"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Aceitar notas do comprador ao pedido</FormLabel>
                    <FormDescription>
                      Se marcado, o comprador poderá adicionar um comentário ao
                      item no pedido
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base">Variações</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddVariation}
                >
                  <CirclePlus />
                  Adicionar variante
                </Button>
              </div>

              <FormDescription>
                Adicione variações para seu produto. Use o acréscimo de preço para variações mais caras.
              </FormDescription>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={variations.fields.map((f: any) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="overflow-y-auto max-h-[400px] space-y-2">
                    {variations.fields.map((field: any, index: number) => (
                      <SortableVariationCard
                        key={field.id}
                        field={field}
                        index={index}
                        form={form}
                        onRemove={() => variations.remove(index)}
                      />
                    ))}
                    {form.formState.errors.variations?.root && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.variations.root.message}
                      </p>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <Separator />

            <Label>Imagens</Label>

            {images.fields.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleImageDragEnd}
              >
                <SortableContext
                  items={images.fields.map((f: any) => f.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="flex flex-row flex-wrap gap-4 pt-1">
                    {images.fields.map((field: any, index: number) => (
                      <SortableImageItem
                        key={field.id}
                        fieldId={field.id}
                        index={index}
                        src={form.watch(`images.${index}`)}
                        form={form}
                        onRemove={() => images.remove(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {images.fields.length < 10 && (
              <FileUploader
                multiple
                maxFileCount={10 - images.fields.length}
                onUpload={async (files: File[]) => {
                  for (const file of files) {
                    const result = await handleImageUpload([file]);
                    if (result) images.append(result.url);
                  }
                }}
              />
            )}

            <Button
              type="submit"
              disabled={!form.formState.isValid || loadingAction}
            >
              {loadingAction ? (
                <Loader2 className="animate-spin" />
              ) : (
                <SaveIcon />
              )}
              Salvar produto
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
