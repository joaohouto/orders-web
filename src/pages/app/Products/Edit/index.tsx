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
  CirclePlus,
  CircleXIcon,
  GripVertical,
  Loader2,
  SaveIcon,
  Trash2,
} from "lucide-react";
import { FileUploader } from "@/components/file-uploader";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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

function SortableVariationRow({
  varField,
  varIndex,
  groupIndex,
  form,
  onRemove,
}: {
  varField: { id: string };
  varIndex: number;
  groupIndex: number;
  form: any;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: varField.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-end gap-2">
      <button
        type="button"
        className="mb-1 cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <FormField
        control={form.control}
        name={`variationGroups.${groupIndex}.variations.${varIndex}.name`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Variação</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: Azul" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="w-36">
        <MoneyInput
          form={form}
          label="Acréscimo"
          name={`variationGroups.${groupIndex}.variations.${varIndex}.priceAdjustment`}
          placeholder="R$ 0,00"
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 mb-0.5"
      >
        <CircleXIcon />
      </Button>
    </div>
  );
}

function SortableVariationGroupCard({
  field,
  groupIndex,
  form,
  onRemove,
}: {
  field: { id: string };
  groupIndex: number;
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

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: `variationGroups.${groupIndex}.variations`,
  });

  const varSensors = useSensors(useSensor(PointerSensor));

  function handleVariationDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  }

  return (
    <Card ref={setNodeRef} style={style} className="border border-muted py-0">
      <CardHeader className="pt-4 pb-2 flex flex-row items-start gap-2">
        <button
          type="button"
          className="mt-7 cursor-grab touch-none text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <FormField
          control={form.control}
          name={`variationGroups.${groupIndex}.name`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Nome do grupo</FormLabel>
              <FormControl>
                <Input placeholder="Ex.: Cor, Tamanho, Tecido" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="mt-6 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        >
          <Trash2 />
        </Button>
      </CardHeader>

      <CardContent className="pb-4 space-y-3">
        <DndContext
          sensors={varSensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleVariationDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((varField, varIndex) => (
              <SortableVariationRow
                key={varField.id}
                varField={varField}
                varIndex={varIndex}
                groupIndex={groupIndex}
                form={form}
                onRemove={() => remove(varIndex)}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", priceAdjustment: 0 })}
        >
          <CirclePlus />
          Adicionar variação
        </Button>
      </CardContent>
    </Card>
  );
}

const formSchema = z.object({
  slug: z.string({ message: "Forneça um valor" }),
  name: z.string({ message: "Forneça um valor" }),
  description: z.string({ message: "Forneça um valor" }).optional(),
  price: z.coerce.number({ message: "Informe um preço" }).positive({ message: "Preço deve ser positivo" }),
  isActive: z.boolean().default(true),
  acceptOrderNote: z.boolean().default(false),
  images: z.array(z.string().url()),
  variationGroups: z.array(
    z.object({
      name: z.string({ message: "Informe o nome do grupo" }),
      variations: z
        .array(
          z.object({
            name: z.string({ message: "Informe este campo" }),
            priceAdjustment: z.coerce.number().default(0),
          })
        )
        .min(1, { message: "Adicione ao menos uma variação" }),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

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

  const form = useForm<FormValues>({
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
        variationGroups: product.variationGroups.map((g: any) => ({
          name: g.name,
          variations: g.variations.map((v: any) => ({
            name: v.name,
            priceAdjustment: Number(v.priceAdjustment ?? 0),
          })),
        })),
      });
    }
  }, [product]);

  const variationGroups = useFieldArray({
    control: form.control,
    name: "variationGroups",
  } as never);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleGroupDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = (variationGroups as any).fields.findIndex((f: any) => f.id === active.id);
      const newIndex = (variationGroups as any).fields.findIndex((f: any) => f.id === over.id);
      (variationGroups as any).move(oldIndex, newIndex);
    }
  }

  function handleImageDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = (images as any).fields.findIndex((f: any) => f.id === active.id);
      const newIndex = (images as any).fields.findIndex((f: any) => f.id === over.id);
      (images as any).move(oldIndex, newIndex);
    }
  }

  async function onSubmit(values: FormValues) {
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
                <FormLabel className="text-base">Grupos de variações</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    (variationGroups as any).append({
                      name: "",
                      variations: [{ name: "", priceAdjustment: 0 }],
                    })
                  }
                >
                  <CirclePlus />
                  Adicionar grupo
                </Button>
              </div>

              <FormDescription>
                Crie grupos de variações (ex: Cor, Tamanho). Dentro de cada grupo adicione as opções disponíveis.
              </FormDescription>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleGroupDragEnd}
              >
                <SortableContext
                  items={(variationGroups as any).fields.map((f: any) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {(variationGroups as any).fields.map((field: any, index: number) => (
                      <SortableVariationGroupCard
                        key={field.id}
                        field={field}
                        groupIndex={index}
                        form={form}
                        onRemove={() => (variationGroups as any).remove(index)}
                      />
                    ))}
                    {(form.formState.errors.variationGroups as any)?.root && (
                      <p className="text-sm font-medium text-destructive">
                        {(form.formState.errors.variationGroups as any).root.message}
                      </p>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <Separator />

            <Label>Imagens</Label>

            {(images as any).fields.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleImageDragEnd}
              >
                <SortableContext
                  items={(images as any).fields.map((f: any) => f.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="flex flex-row flex-wrap gap-4 pt-1">
                    {(images as any).fields.map((field: any, index: number) => (
                      <SortableImageItem
                        key={field.id}
                        fieldId={field.id}
                        index={index}
                        src={form.watch(`images.${index}` as any)}
                        form={form}
                        onRemove={() => (images as any).remove(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {(images as any).fields.length < 10 && (
              <FileUploader
                multiple
                maxFileCount={10 - (images as any).fields.length}
                onUpload={async (files: File[]) => {
                  for (const file of files) {
                    const result = await handleImageUpload([file]);
                    if (result) (images as any).append(result.url);
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
