import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Copy, InfoIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "recharts";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { LoadingPage } from "@/components/page-loading";
import { ErrorPage } from "@/components/page-error";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export function PixPaymentPage() {
  const [copied, setCopied] = useState(false);

  const { orderId } = useParams();

  const {
    data: payment,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`payment-${orderId}`],
    queryFn: getPayment,
  });

  async function getPayment() {
    const res = await api.get(`/orders/${orderId}/payment/pix`);
    return res.data;
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(payment.pix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.info("Copiado!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete seu pagamento</CardTitle>
          <CardDescription>
            Escaneie o QRCode ou copie o código Pix para o seu app de banco
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center p-4 bg-muted rounded-lg">
            <img className="rounded-lg" src={payment.qrcode} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Código de pagamento</Label>

            <div className="flex gap-2">
              <Input
                id="payment-code"
                value={payment.pix}
                readOnly
                className="font-mono text-sm"
              />

              <Button
                variant="default"
                className="shrink-0"
                size="icon"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Atenção, pague só uma vez.</AlertTitle>
            <AlertDescription className="text-balance">
              Iremos confirmar o seu pagamento manualmente em até 1 dia útil.
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-medium mb-2">Como pagar?</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Escaneie o QRCode com seu app de banco</li>
              <li>Ou copie o código Pix para o seu portal de pagamento</li>
              <li>Complete o processo de pagamento no app</li>
              <li>
                Quando seu pagamento for confirmado, você receberá um aviso no
                seu email
              </li>
            </ol>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Link to="/orders">Ir para meus pedidos</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
