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
import { formatCPF, moneyFormatter } from "@/lib/utils";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Link, useNavigate, useParams } from "react-router";
import QRCode from "react-qr-code";
import OrderStatusHistory from "@/components/order-status-history";
import { PaymentCard } from "@/components/payment-item";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CircleX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { PixIcon } from "@/components/pix-icon";

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
      <div className="w-full md:max-w-[600px] mx-auto py-8 px-4 flex flex-col gap-8">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>

        {isLoading && (
          <>
            {/* Store card */}
            <Skeleton className="h-16 w-full rounded-xl" />

            {/* Main order card */}
            <div className="rounded-xl border overflow-hidden">
              <div className="bg-muted px-6 pt-6 pb-4 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28 rounded" />
                  <Skeleton className="h-4 w-48 rounded" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              <div className="px-6 py-5 flex flex-col gap-4">
                <Skeleton className="h-4 w-36 rounded" />

                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[48px_auto_1fr_auto] items-center gap-2"
                  >
                    <Skeleton className="size-12 rounded-md" />
                    <Skeleton className="h-4 w-6 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-14 rounded" />
                  </div>
                ))}

                <div className="flex justify-between">
                  <Skeleton className="h-4 w-10 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>

                <Skeleton className="h-px w-full rounded" />

                <Skeleton className="h-4 w-44 rounded" />

                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-4 w-28 rounded" />
                  </div>
                ))}
              </div>

              <div className="border-t px-6 py-4">
                <Skeleton className="h-4 w-52 rounded" />
              </div>
            </div>

            {/* Status history */}
            <div className="rounded-xl border px-6 py-5 flex flex-col gap-3">
              <Skeleton className="h-4 w-32 rounded" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-2 rounded-full flex-shrink-0" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              ))}
            </div>

            {/* QR code card */}
            <div className="rounded-xl border px-6 py-5 flex flex-col gap-3">
              <Skeleton className="h-5 w-28 rounded" />
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-40 w-40 mx-auto rounded-lg" />
            </div>
          </>
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
            {order.store && (
              <Link
                to={`/${order.store.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl border bg-background hover:border-primary transition-colors w-full"
              >
                <img
                  src={order.store.icon || "/placeholder.svg"}
                  alt={order.store.name}
                  className="size-10 rounded-lg border bg-muted object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground leading-none mb-1">
                    Pedido na loja
                  </p>
                  <p className="text-sm font-semibold leading-none">
                    {order.store.name}
                  </p>
                </div>
              </Link>
            )}

            <Card className="py-0">
              <CardHeader className="rounded-t-xl bg-muted pt-6 pb-4 grid grid-cols-[1fr_auto]">
                <div className="flex flex-col">
                  <CardTitle>Pedido #{order.code}</CardTitle>
                  <CardDescription>
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
                    className="grid grid-cols-[48px_auto_1fr_auto] items-center gap-2 text-sm text-muted-foreground"
                  >
                    <img
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.productName}
                      className="size-[48px) aspect-square rounded-md border bg-muted object-contain"
                    />

                    <span className="text-center">{item.quantity}x</span>
                    <span>
                      {item.productName} -{" "}
                      {item.selectedVariations
                        ?.map((v: any) => v.variationName)
                        .join(" / ")}{" "}
                      <br />
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

                {order.status === "PENDING" && (
                  <Button type="button" asChild>
                    <Link to={`/orders/${orderId}/pix`}>
                      <PixIcon />
                      Pagar com PIX
                    </Link>
                  </Button>
                )}

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
                      "($1) $2-$3",
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 ">
                  <span className="text-muted-foreground">CPF</span>
                  <span className="text-right">
                    {formatCPF(order.user.document)}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="border-t rounded-b-xl pb-6 pt-6">
                <span className="text-sm text-muted-foreground">
                  Atualizado em{" "}
                  {dayjs(order.updatedAt)
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
                <CardDescription>#{orderId}</CardDescription>
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
