import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { info } from "@/config/app";
import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlusIcon, Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string({
    message: "Insira um nome",
  }),
  slug: z.string({
    message: "Defina um URL para página",
  }),
});

export function CreateStoreButton({
  onCreateStore,
}: {
  onCreateStore: (storeSlug: string) => any;
}) {
  const [loadingAction, setLoadingAction] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingAction(true);

    try {
      const response = await api.post(`/stores/`, values);

      toast.success("Loja criada!");

      onCreateStore(response.data.slug);
    } catch (err) {
      console.log(err);
      toast.error("Erro ao criar página");
    } finally {
      setLoadingAction(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center justify-center gap-2 mt-6">
          <CirclePlusIcon className="h-4 w-4" />
          Criar nova loja
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Criar nova loja</DialogTitle>
              <DialogDescription>
                Venda seus produtos com ela!
              </DialogDescription>
            </DialogHeader>

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

            <DialogFooter>
              <Button type="submit" disabled={loadingAction}>
                {loadingAction ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <PlusCircle />
                )}
                Criar nova loja
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
