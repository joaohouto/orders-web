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
import {
  ArrowLeft,
  ArrowRight,
  Bird,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { PhoneInput } from "@/components/phone-input";
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
import { formatCPF, isValidCPF, moneyFormatter } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useState } from "react";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import api from "@/services/api";
import { Cart } from "@/types/cart";
import { CPFInput } from "@/components/cpf-input";

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
    .min(14, "Número incompleto")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),

  document: z.string().refine(isValidCPF, {
    message: "CPF inválido",
  }),
});

export function CheckoutPage() {
  const navigate = useNavigate();

  const { cart, clearCart } = useCartStore((state) => state);

  let subtotal = 0;
  for (const item of cart) {
    subtotal += item.quantity * +item.product.price;
  }

  const { user, updateUser } = useAuth();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone?.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3"),
      document: formatCPF(user?.document),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingSubmit(true);

    try {
      const response = await api.patch("/users/profile", {
        name: values.name,
        phone: values.phone?.replace(/\D/g, ""),
        document: values.document?.replace(/\D/g, ""),
      });

      updateUser(response.data);

      const items = cart.map((cartItem: Cart) => {
        return {
          productId: cartItem.product.productId,
          variationId: cartItem.product.id,
          quantity: cartItem.quantity,
          note: cartItem.product.note,
        };
      });

      const orderResponse = await api.post(
        `/stores/${cart[0].product.storeId}/orders`,
        {
          items,
        }
      );

      toast.success(`Pedido criado! ID ${orderResponse.data.id}`);

      navigate("/orders");
      clearCart();
    } catch (err) {
      toast.error("Erro ao criar pedido");
      console.log(err);
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <div className="bg-muted">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full md:max-w-[600px] mx-auto py-8 px-4 flex flex-col gap-8">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft />
            </Button>

            <Card>
              <CardHeader className="border-b">
                <CardTitle>Revise o seu pedido</CardTitle>
                <CardDescription>
                  Verifique se todos os items estão corretos.
                </CardDescription>
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
                <CardTitle>Seu perfil</CardTitle>
                <CardDescription>
                  Mantenha suas informações atualizadas para que possamos ter
                  facilidade para contatar você.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
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

                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu CPF</FormLabel>
                        <FormControl>
                          <CPFInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Button size="lg" disabled={loadingSubmit || cart.length === 0}>
              {loadingSubmit ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CheckCircle />
              )}
              Fechar pedido
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
