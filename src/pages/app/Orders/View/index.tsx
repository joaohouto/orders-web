import { AppHeader } from "@/components/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import { useParams } from "react-router";

export function ViewOrderPage() {
  const { orderId } = useParams();

  return (
    <>
      <AppHeader
        routes={[
          { path: "orders", title: "Pedidos" },
          { path: `orders/v/${orderId}`, title: orderId || "" },
        ]}
      />

      <div className="w-full md:max-w-[600px] mx-auto p-8">
        <Card className="py-0">
          <CardHeader className="rounded-t-xl bg-muted pt-6 pb-4 grid grid-cols-[1fr_auto]">
            <div className="flex flex-col">
              <CardTitle className="text-xl">Pedido #{orderId}</CardTitle>
              <CardDescription>
                Criado em{" "}
                {dayjs()
                  .locale("pt-Br")
                  .format("DD [de] MMMM [de] YYYY [às] HH:mm")}
              </CardDescription>
            </div>

            <Badge>Em preparação</Badge>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <h3 className="font-semibold">Detalhes do pedido</h3>

            <div className="grid grid-cols-[56px_24px_1fr_100px] gap-2 text-muted-foreground">
              <img
                src=""
                alt="."
                className="size-[56px) aspect-square rounded bg-muted object-contain"
              />

              <span className="text-center">1x</span>
              <span>
                Camiseta Futebol Americano - Tamaho M - Número 10, Nome JOÃO
              </span>
              <span className="text-right">R$ 100,00</span>
            </div>

            <div className="grid grid-cols-[56px_24px_1fr_100px] gap-2 text-muted-foreground">
              <img
                src=""
                alt="."
                className="size-[56px) aspect-square rounded bg-muted object-contain"
              />

              <span className="text-center">1x</span>
              <span>
                Camiseta Futebol Americano - Tamaho M - Número 10, Nome JOÃO
              </span>
              <span className="text-right">R$ 100,00</span>
            </div>

            <div className="grid grid-cols-[56px_24px_1fr_100px] gap-2 text-muted-foreground">
              <img
                src=""
                alt="."
                className="size-[56px) aspect-square rounded bg-muted object-contain"
              />

              <span className="text-center">1x</span>
              <span>
                Camiseta Futebol Americano - Tamaho M - Número 10, Nome JOÃO
              </span>
              <span className="text-right">R$ 100,00</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-muted-foreground">
              <h3>Subtotal</h3>
              <span className="text-right">R$ 100,00</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <h3 className="text-muted-foreground">Total</h3>
              <span className="text-right font-semibold">R$ 100,00</span>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <strong>Entrega</strong>
              <span className="text-muted-foreground">
                Avenida Manoel Murtinho, 1831 - Anastácio/MS - 79210-000
              </span>
            </div>

            <h3 className="font-semibold">Informações de contato</h3>

            <div className="grid grid-cols-2 gap-2 ">
              <span className="text-muted-foreground">Nome</span>
              <span className="text-right">João Herique Martins Couto</span>
            </div>

            <div className="grid grid-cols-2 gap-2 ">
              <span className="text-muted-foreground">Telefone</span>
              <span className="text-right">(67) 9 9237-8640</span>
            </div>
          </CardContent>

          <CardFooter className="border-t rounded-b-xl pb-6 pt-6">
            <span className="text-sm text-muted-foreground">
              Atualizado em{" "}
              {dayjs()
                .locale("pt-Br")
                .format("DD [de] MMMM [de] YYYY [às] HH:mm")}
            </span>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
