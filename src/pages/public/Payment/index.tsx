import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "recharts";
import { Link } from "react-router";

export function PaymentPage() {
  const [pixQRCode, setPixQRCode] = useState(
    "https://gerador-qrcode-r2pk3ukt5q-rj.a.run.app/pix/Joao/Aquidauana/pix@joaocouto.com/1.00"
  );
  const [pix, setPix] = useState("");

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(
        "https://gerador-qrcode-r2pk3ukt5q-rj.a.run.app/copicola/Joao/Aquidauana/pix@joaocouto.com/1.00",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          referrerPolicy: "no-referrer",
        }
      );

      const json = await response.json();

      console.log(json);

      setPix(json);
    })();
  }, []);

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
            <img src={pixQRCode} />
          </div>

          <div className="space-y-2">
            <Label>Código de pagamento</Label>
            <div className="flex space-x-2">
              <Input
                id="payment-code"
                value={pix}
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
          <Button className="w-full">
            <Link to="/orders">Ir para meus pedidos</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
