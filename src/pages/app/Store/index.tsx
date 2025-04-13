import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { useParams } from "react-router";
import { Loader2, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { FileUploader } from "@/components/file-uploader";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { LoadingPage } from "@/components/page-loading";
import { ErrorPage } from "@/components/page-error";
import { info } from "@/config/app";

const formSchema = z.object({
  name: z.string({
    message: "Insira um nome",
  }),
  slug: z.string({
    message: "Defina um URL para página",
  }),
  instagram: z.string({
    message: "Informe este campo",
  }),
  icon: z.string().url().optional(),
  banner: z.string().url().optional(),
});

export function StorePage() {
  const [loadingAction, setLoadingAction] = useState(false);

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

  useEffect(() => {
    if (store) {
      form.reset({
        name: store.name,
        slug: store.slug,
        instagram: store.instagram,
        icon: store.icon,
        banner: store.banner,
      });
    }
  }, [store]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingAction(true);

    try {
      await api.put(`/stores/${store.id}`, values);

      toast.success("Dados atualizados!");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao atualizar página");
    } finally {
      setLoadingAction(false);
    }
  }

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
      <AppHeader routes={[{ path: "", title: "Painel" }]} />

      <div className="w-full md:max-w-[600px] mx-auto p-8">
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
                  <FormLabel>Endereço</FormLabel>
                  <div className="flex gap-2">
                    <div className="text-muted-foreground border-input flex h-9 w-[288px] min-w-0 rounded-md border bg-muted px-3 py-2 text-base shadow-xs md:text-sm">
                      <span>{info.appUrl}</span>
                    </div>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </div>

                  <FormDescription>
                    URL por onde sua página é acessada
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário do Instagram</FormLabel>
                  <div className="flex gap-2">
                    <div className="text-muted-foreground border-input flex h-9 w-[42px] min-w-0 rounded-md border bg-muted px-3 py-2 text-base shadow-xs md:text-sm">
                      @
                    </div>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone</FormLabel>
                  <img
                    src={form.watch("icon")}
                    className="size-[100px] rounded-xl border"
                  />
                  <FormControl>
                    <Input className="hidden" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use uma imagem de dimensões 100 x 100px
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FileUploader
              onUpload={async (files: File[]) => {
                const file = await handleImageUpload(files);
                form.setValue("icon", file.url);
              }}
            />

            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner</FormLabel>
                  <img
                    src={form.watch("banner")}
                    className="w-full h-[200px] bg-muted rounded-xl border object-cover"
                  />

                  <FormControl>
                    <Input className="hidden" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use uma imagem de dimensões 656 x 200px
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FileUploader
              onUpload={async (files: File[]) => {
                const file = await handleImageUpload(files);
                form.setValue("banner", file.url);
              }}
            />

            <Button type="submit" disabled={loadingAction}>
              {loadingAction ? (
                <Loader2 className="animate-spin" />
              ) : (
                <SaveIcon />
              )}
              Salvar página
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
