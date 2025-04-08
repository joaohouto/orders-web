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
import { CircleXIcon, CreditCardIcon } from "lucide-react";
import { CancelOrderDialog } from "./cancel-order-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { stat } from "fs";

type ProductItem = {
  imageUrl: string;
  quantity: number;
  name: string;
  variation: string;
  price: number;
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
};

export function OrderItem({
  orderId,
  createdAt,
  updatedAt,
  status,
  products,
  total,
}: OrderItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="py-0">
        <CardHeader className="rounded-t-xl bg-muted pt-6 pb-4 grid grid-cols-[1fr_auto]">
          <div className="flex flex-col">
            <CardTitle>Pedido {orderId}</CardTitle>

            <CardDescription>
              Criado em{" "}
              {dayjs(createdAt)
                .locale("pt-BR")
                .format("DD [de] MMMM [de] YYYY [às] HH:mm")}
            </CardDescription>
          </div>

          <Badge variant={status === "CANCELED" ? "outline" : "default"}>
            {orderStatuses[status]}
          </Badge>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <h3 className="font-semibold">Detalhes do pedido</h3>

          {products.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[56px_24px_1fr_100px] items-center gap-2 text-muted-foreground"
            >
              <img
                src={item.product.images[0] || "/placeholder.svg"}
                alt={item.productName}
                className="size-[56px] aspect-square rounded-md border object-contain"
              />

              <span className="text-center">{item.quantity}x</span>
              <span>
                {item.productName} ({item.variationName}) {item.note}
              </span>
              <span className="text-right">
                {moneyFormatter.format(item.unitPrice * item.quantity)}
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

        <CardFooter className="border-t rounded-b-xl pb-6 pt-6 gap-4 flex flex-col md:flex-row">
          {status === "PENDING" && (
            <Button type="button" variant="secondary">
              <CreditCardIcon />
              Efetuar pagamento
            </Button>
          )}

          {status !== "CANCELED" && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(true)}
            >
              <CircleXIcon />
              Cancelar pedido
            </Button>
          )}
        </CardFooter>
      </Card>

      <CancelOrderDialog
        open={open}
        onOpenChange={setOpen}
        orderId={orderId}
        onSuccess={() => {
          // refetch orders, toast, etc
          toast.success("Pedido cancelado com sucesso!");
          window.location.href = "/profile";
        }}
      />
    </>
  );
}
