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

const formSchema = z.object({
  slug: z.string({ message: "Forneça um valor" }),
  name: z.string({ message: "Forneça um valor" }),
  description: z.string({ message: "Forneça um valor" }).optional(),
  price: z.coerce.number({ message: "Informe um preço" }).positive({ message: "Preço deve ser positivo" }),
  isActive: z.boolean().default(true),
  acceptOrderNote: z.boolean().default(false),
  images: z.array(z.string().url()),
  variationGroups: z
    .array(
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
    )
    .min(1, { message: "Adicione ao menos um grupo de variações" }),
});

type FormValues = z.infer<typeof formSchema>;

function VariationGroupCard({
  groupIndex,
  form,
  onRemove,
}: {
  groupIndex: number;
  form: any;
  onRemove: () => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `variationGroups.${groupIndex}.variations`,
  });

  return (
    <Card className="border border-muted py-0">
      <CardHeader className="pt-4 pb-2 flex flex-row items-start justify-between gap-2">
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
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <FormField
              control={form.control}
              name={`variationGroups.${groupIndex}.variations.${index}.name`}
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
                name={`variationGroups.${groupIndex}.variations.${index}.priceAdjustment`}
                placeholder="R$ 0,00"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 mb-0.5"
            >
              <CircleXIcon />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", priceAdjustment: 0 })}
        >
          <CirclePlus />
          Adicionar variação
        </Button>

        {(form.formState.errors.variationGroups?.[groupIndex]?.variations as any)?.root && (
          <p className="text-sm font-medium text-destructive">
            {(form.formState.errors.variationGroups?.[groupIndex]?.variations as any).root.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function CreateProductPage() {
  const [loadingAction, setLoadingAction] = useState(false);

  const { storeSlug } = useParams();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const variationGroups = useFieldArray({
    control: form.control,
    name: "variationGroups",
  } as never);

  async function onSubmit(values: FormValues) {
    setLoadingAction(true);

    try {
      const response = await api.post(`/stores/${storeSlug}/products`, values);

      toast.success(`Produto criado! ID ${response.data.id}`);

      navigate(-1);
    } catch (err) {
      console.log(err);
      toast.error("Erro ao criar produto");
    } finally {
      setLoadingAction(false);
    }
  }

  useEffect(() => {
    if (form.watch("name")) {
      form.setValue(
        "slug",
        form.watch("name")?.toLocaleLowerCase()?.replaceAll(" ", "-")
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

  return (
    <>
      <AppHeader
        routes={[
          { path: "products", title: "Produtos" },
          { path: "create", title: "Criar novo" },
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

              {(variationGroups as any).fields.map((_: any, index: number) => (
                <VariationGroupCard
                  key={(variationGroups as any).fields[index].id}
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

            <Separator />

            <Label>Imagens</Label>

            <div className="flex gap-4 flex-wrap">
              {(images as any).fields.map((field: any, index: number) => (
                <div key={field.id}>
                  <div className="relative w-fit">
                    <img
                      src={form.watch(`images.${index}` as any)}
                      className="size-[100px] border rounded-md object-contain"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => (images as any).remove(index)}
                      className="absolute right-0 top-0"
                    >
                      <CircleXIcon />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`images.${index}` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="hidden" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            {(images as any).fields.length < 5 && (
              <FileUploader
                multiple
                maxFileCount={5}
                onUpload={async (files: File[]) => {
                  const file = await handleImageUpload(files);
                  (images as any).append(file.url);
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
