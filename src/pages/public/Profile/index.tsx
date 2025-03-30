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
import { ArrowLeft, SaveIcon } from "lucide-react";
import { PhoneInput } from "@/components/phone-input";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router";

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
    .min(1, "O telefone é obrigatório")
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length === 10 || digits.length === 11;
      },
      {
        message: "O telefone deve ter 10 dígitos ou 11 dígitos",
      }
    ),
});

export function ProfilePage() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "João Henrique",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <PhoneInput name="phone" control={form.control} />

                <Button type="submit">
                  <SaveIcon />
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
