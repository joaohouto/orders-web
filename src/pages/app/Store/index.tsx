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
import { SaveIcon } from "lucide-react";
import { useState } from "react";

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
});

export function StorePage() {
  const { storeSlug } = useParams();

  const [loadingSubmit, setLoadingSpin] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Direito Aquidauana",
      slug: storeSlug,
      instagram: "direitoaquidauana",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}

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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <div className="flex gap-2">
                    <div className="text-muted-foreground border-input flex h-9 w-[208px] min-w-0 rounded-md border bg-muted px-3 py-2 text-base shadow-xs md:text-sm">
                      https://orders.com/
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

            <Button type="submit">
              <SaveIcon />
              Salvar página
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
