import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreditCard, QrCode } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PaymentProps {
  payment: {
    id: string;
    provider: string;
    providerPaymentId: string;
    status: string;
    orderId: string;
    amount: number;
    method: string;
    installments: number;
    approvedAt: Date;
    createdAt: Date;
  };
}

export function PaymentCard({ payment }: PaymentProps) {
  // Format currency to BRL
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {payment.provider.toLowerCase().includes("pix") ? (
              <QrCode className="h-5 w-5" />
            ) : (
              <CreditCard className="h-5 w-5" />
            )}
            <CardTitle className="text-lg">
              Pagamento #{payment.providerPaymentId}
            </CardTitle>
          </div>
          <Badge variant="outline">{payment.status}</Badge>
        </div>
        <CardDescription>
          {payment.provider === "mercadopago" ? "Mercado Pago" : "PIX"} •{" "}
          {formatDistanceToNow(new Date(payment.createdAt), {
            addSuffix: true,
            locale: ptBR,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Valor</span>
            <span className="font-semibold text-lg">
              {formatCurrency(payment.amount)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Método</span>
            <span>
              {payment.method}{" "}
              {payment.installments > 1 ? `(${payment.installments}x)` : ""}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Data de aprovação
            </span>
            <span>
              {new Date(payment.approvedAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
