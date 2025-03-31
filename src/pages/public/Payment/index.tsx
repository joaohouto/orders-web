import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Copy, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "recharts";

import { QrCodePix } from "qrcode-pix";

export function PaymentPage() {
  const [copied, setCopied] = useState(false);

  const [qrCodeIMG, setQrCodeIMG] = useState("");

  const qrCodePix = QrCodePix({
    version: "01",
    key: "pix@joaocouto.com",
    name: "Fulano de Tal",
    city: "AQUIDAUANA",
    transactionId: "YOUR_TRANSACTION_ID", //max 25 characters
    message: "Pay me :)",
    cep: "79210000",
    value: 150.99,
  });

  useEffect(() => {
    (async () => {
      const image = await qrCodePix.base64();
      setQrCodeIMG(image);
    })();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrCodePix.payload());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete seu pagamento</CardTitle>
          <CardDescription>
            Escaneie o QRCode ou copie o código Pix para o seu app de banco
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center p-4 bg-muted rounded-lg">
            <img src={qrCodeIMG} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-code">Payment Code</Label>
            <div className="flex space-x-2">
              <Input
                id="payment-code"
                value={qrCodePix.payload()}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

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
          <Button className="w-full">Ir para meus pedidos</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
