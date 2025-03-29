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
import { CirclePlus, Package, SaveIcon, Trash2, XIcon } from "lucide-react";
import { FileUploader } from "@/components/file-uploader";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import MoneyInput from "@/components/money-input";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string({
    message: "Forneça um valor",
  }),
  price: z.number({
    message: "Forneça um valor",
  }),
  description: z.string({
    message: "Forneça um valor",
  }),
  isActive: z.boolean().default(true),
  variations: z
    .array(
      z.object({
        name: z.string({ message: "Informe este campo" }),
        price: z.coerce.number({ message: "Informe um preço" }),
      })
    )
    .optional(),
});

export function CreateProductPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variations",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
                  <FormDescription>O título do seu produto.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MoneyInput
              form={form}
              label="Preço"
              name="price"
              placeholder="R$"
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

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base">Variações</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "", price: 0 })}
                >
                  <CirclePlus />
                  Adicionar variante
                </Button>
              </div>

              <FormDescription>
                Adicione variações para seu produto com seus respectivos preços.
              </FormDescription>

              {fields.map((field, index) => (
                <Card key={field.id} className="border border-muted">
                  <CardContent className="pt-2">
                    <div className="grid gap-4 sm:grid-cols-[auto_140px]">
                      <FormField
                        control={form.control}
                        name={`variations.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da variante</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex.: P, M, G, etc."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <MoneyInput
                        form={form}
                        label="Preço"
                        name={`variations.${index}.price`}
                        placeholder="R$"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t bg-muted/20 p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 />
                      Remover
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {form.formState.errors.variations?.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.variations.root.message}
                </p>
              )}
            </div>

            <Label>Imagens</Label>

            <FileUploader multiple maxFileCount={5} />

            <Button type="submit" disabled={!form.formState.isValid}>
              <SaveIcon />
              Salvar produto
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
