import { OrderStatusBadge } from "@/components/order-status-badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { moneyFormatter } from "@/lib/utils";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router";
import QRCode from "react-qr-code";
import OrderStatusHistory from "@/components/order-status-history";
import { PaymentCard } from "@/components/payment-item";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CircleX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";

export function ViewUserOrderPage() {
  const { orderId } = useParams();

  const navigate = useNavigate();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`order-${orderId}`],
    queryFn: fetchOrder,
  });

  async function fetchOrder() {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  }

  return (
    <>
      <Header />
      <div className="w-full md:max-w-[600px] mx-auto p-8 flex flex-col gap-8">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>

        {isLoading && (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {isError && (
          <Alert>
            <CircleX className="h-4 w-4" />
            <AlertTitle>Não foi possível carregar</AlertTitle>
            <AlertDescription>Tente novamente mais tarde</AlertDescription>
          </Alert>
        )}

        {order && (
          <>
            <Card className="py-0">
              <CardHeader className="rounded-t-xl bg-muted pt-6 pb-4 grid grid-cols-[1fr_auto]">
                <div className="flex flex-col">
                  <CardTitle>Pedido</CardTitle>
                  <CardDescription>
                    Criado em{" "}
                    {dayjs(order.createdAt)
                      .locale("pt-Br")
                      .format("DD [de] MMMM [de] YYYY [às] HH:mm")}
                  </CardDescription>
                </div>

                <OrderStatusBadge status={order.status} />
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <h3 className="font-semibold">Detalhes do pedido</h3>

                {order.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[56px_32px_1fr_100px] gap-2 text-muted-foreground"
                  >
                    <img
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.productName}
                      className="size-[56px) aspect-square rounded-md border bg-muted object-contain"
                    />

                    <span className="text-center">{item.quantity}x</span>
                    <span>
                      {item.productName} - {item.variationName} <br />
                      <i>{item.note}</i>
                    </span>
                    <span className="text-right">
                      {moneyFormatter.format(+item.unitPrice)}
                    </span>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <h3 className="text-muted-foreground">Total</h3>
                  <span className="text-right font-semibold">
                    {moneyFormatter.format(+order.totalPrice)}
                  </span>
                </div>

                <Separator />

                <h3 className="font-semibold">Informações do comprador</h3>

                <div className="grid grid-cols-2 gap-2 ">
                  <span className="text-muted-foreground">Nome</span>
                  <span className="text-right">{order.user.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 ">
                  <span className="text-muted-foreground">Telefone</span>
                  <span className="text-right">
                    {order.user.phone.replace(
                      /^(\d{2})(\d{5})(\d{4})$/,
                      "($1) $2-$3"
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 ">
                  <span className="text-muted-foreground">CPF</span>
                  <span className="text-right">{order.user.document}</span>
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

            <OrderStatusHistory statusUpdates={order.statusHistory} />

            {order.payments?.map((payment: any) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}

            <Card>
              <CardHeader>
                <CardTitle>Identificação</CardTitle>
                <CardDescription>{orderId}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="bg-white p-8 rounded-md flex items-center justify-center">
                  <QRCode size={136} value={orderId || ""} />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
