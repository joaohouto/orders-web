import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, LogOut, SaveIcon } from "lucide-react";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/auth";
import api from "@/services/api";
import { toast } from "sonner";
import { useState } from "react";
import { PhoneInput } from "@/components/phone-input";

const formSchema = z.object({
  name: z.string({
    message: "Forneça este campo",
  }),

  email: z
    .string()
    .min(1, { message: "Forneça este campo" })
    .email("Este email não é válido"),

  phone: z
    .string()
    .min(14, "Número incompleto") // ex: (99) 99999-9999 → 14 chars
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
});

export function ProfilePage() {
  const navigate = useNavigate();

  const { user, updateUser, signOut } = useAuth();

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3"),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingSubmit(true);

    try {
      const response = await api.patch("/users/profile", {
        name: values.name,
        phone: values.phone.replace(/\D/g, ""),
      });

      updateUser(response.data);

      toast.success("Dados atualizados!");
    } catch (err) {
      toast.error("Erro ao salvar! Tente novamente");
      console.log(err);
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <>
      <Header />
      <div className="w-full md:max-w-[600px] mx-auto p-8 flex flex-col gap-8">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Seu perfil</CardTitle>
            <CardDescription>
              Mantenha suas informações atualizadas para que possamos ter
              facilidade para contatar você.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu email</FormLabel>
                      <FormControl>
                        <Input disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
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
                <Button type="submit" disabled={loadingSubmit}>
                  {loadingSubmit ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <SaveIcon />
                  )}
                  Salvar dados
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
