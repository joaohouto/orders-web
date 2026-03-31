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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { LoadingPage } from "@/components/page-loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export function PixPaymentPage() {
  const [copied, setCopied] = useState(false);

  const { orderId } = useParams();
  const navigate = useNavigate();

  const {
    data: payment,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`payment-${orderId}`],
    queryFn: getPayment,
    retry: false,
  });

  async function getPayment() {
    const res = await api.get(`/orders/${orderId}/payment/pix`);
    return res.data;
  }

  useEffect(() => {
    if (isError) {
      toast.error("Não foi possível gerar o código PIX para este pedido.");
      navigate(`/orders/${orderId}`, { replace: true });
    }
  }, [isError]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(payment.pix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Não foi possível copiar. Selecione o código manualmente.");
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete seu pagamento</CardTitle>
          <CardDescription>
            Escaneie o QR Code ou copie o código PIX para o seu app de banco
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center p-6 bg-white rounded-xl border">
            <img
              className="rounded-lg w-48 h-48 object-contain"
              src={payment.qrcode}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Código de pagamento</p>
            <Input
              value={payment.pix}
              readOnly
              className="font-mono text-xs text-muted-foreground"
            />
            <Button
              variant={copied ? "outline" : "default"}
              className="w-full transition-all"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Código copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar código PIX
                </>
              )}
            </Button>
          </div>

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Pague somente uma vez.</AlertTitle>
            <AlertDescription>
              O seu pix irá diretamente para o vendedor, e o pagamento é
              confirmado manualmente por ele.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/orders">Ver meus pedidos</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
