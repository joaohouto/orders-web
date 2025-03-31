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
import { ArrowLeft, Bird, SaveIcon } from "lucide-react";
import { PhoneInput } from "@/components/phone-input";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router";
import { CartItem } from "@/components/cart/item";
import { Separator } from "@/components/ui/separator";
import { moneyFormatter } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

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

export function CheckoutPage() {
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

  const { cart } = useCartStore((state) => state);

  let subtotal = 0;
  for (const item of cart) {
    subtotal += item.quantity * item.product.price;
  }

  return (
    <>
      <div className="w-full md:max-w-[600px] mx-auto p-8 flex flex-col gap-8">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Seu pedido</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-5 my-3">
              {cart.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center p-4">
                <div className="size-12 bg-muted text-muted-foreground rounded-xl flex justify-center items-center mb-4">
                  <Bird />
                </div>

                <strong>Nada por aqui</strong>
                <span className="text-sm text-muted-foreground">
                  Escolha algum produto na loja
                </span>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t">
            <div className="w-full flex justify-between items-center">
              <div>Subtotal:</div>
              <span className="font-semibold">
                {moneyFormatter.format(subtotal)}
              </span>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Seus dados</CardTitle>
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
              </form>
            </Form>
          </CardContent>
        </Card>

        <Button size="lg">Prosseguir para o pagamento</Button>
      </div>
    </>
  );
}
