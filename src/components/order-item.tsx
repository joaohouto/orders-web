import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { moneyFormatter } from "@/lib/utils";
import { Button } from "./ui/button";
import { CircleXIcon, CreditCardIcon, Loader2 } from "lucide-react";
import { CancelOrderDialog } from "./cancel-order-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "react-router";
import api from "@/services/api";
import { PixIcon } from "./pix-icon";
import { OrderStatusBadge } from "./order-status-badge";

type ProductItem = {
  product: {
    images: string[];
  };
  productName: string;
  variationName: string;
  variation: string;
  quantity: number;
  unitPrice: number;
  note?: string;
};

const orderStatuses = {
  PENDING: "PENDENTE",
  CONFIRMED: "CONFIRMADO",
  IN_PRODUCTION: "EM PRODUÇÃO",
  READY: "PRONTO",
  DELIVERED: "ENTREGUE",
  CANCELED: "CANCELADO",
};

type OrderStatus = keyof typeof orderStatuses;

type OrderItemProps = {
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  products: ProductItem[];
  total: number;
  onCancelled?: () => void;
};

export function OrderItem({
  orderId,
  createdAt,
  updatedAt,
  status,
  products,
  total,
  onCancelled,
}: OrderItemProps) {
  const [open, setOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  async function redirectToCheckout() {
    setLoadingAction(true);

    try {
      const response = await api.get(`/orders/${orderId}/payment/mercadopago`);

      window.location.href = response.data.redirectTo;
    } catch (err) {
      console.log(err);
      toast.error("Erro ao redirecionar para o Mercado Pago");
    } finally {
      setLoadingAction(false);
    }
  }

  return (
    <>
      <Card className="py-0">
        <CardHeader className="rounded-t-xl bg-muted pt-6 pb-4 grid grid-cols-[1fr_auto] gap-2">
          <div className="flex flex-col">
            <CardTitle>Pedido criado em</CardTitle>
            <CardDescription>
              {dayjs(createdAt)
                .locale("pt-BR")
                .format("DD [de] MMMM [de] YYYY [às] HH:mm")}
            </CardDescription>
          </div>

          <OrderStatusBadge status={status} />
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <h3 className="font-semibold">Detalhes do pedido</h3>

          {products.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[48px_auto_1fr_auto] items-center gap-2 text-sm text-muted-foreground"
            >
              <img
                src={item.product.images[0] || "/placeholder.svg"}
                alt={item.productName}
                className="size-[48px) aspect-square rounded-md border bg-muted object-contain"
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
              {moneyFormatter.format(+total)}
            </span>
          </div>
        </CardContent>

        <CardFooter className="border-t rounded-b-xl pb-6 pt-6 gap-4 flex flex-wrap">
          {status === "PENDING" && (
            <Button type="button" asChild>
              <Link to={`/orders/${orderId}/pix`}>
                <PixIcon />
                Pagar com PIX
              </Link>
            </Button>
          )}

          {["PENDING"].includes(status) && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(true)}
            >
              <CircleXIcon />
              Cancelar pedido
            </Button>
          )}

          <Button type="button" variant="outline" className="w-full" asChild>
            <Link to={`/orders/${orderId}`}>Mais detalhes</Link>
          </Button>
        </CardFooter>
      </Card>

      <CancelOrderDialog
        open={open}
        onOpenChange={setOpen}
        orderId={orderId}
        onSuccess={() => {
          onCancelled?.();
        }}
      />
    </>
  );
}
