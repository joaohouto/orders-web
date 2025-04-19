import { useState } from "react";

import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useNavigate, useParams } from "react-router";
import { isCuid } from "cuid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QrCode } from "lucide-react";

export function SearchOrderPage() {
  const navigate = useNavigate();
  const { storeSlug } = useParams();

  return (
    <>
      <AppHeader
        routes={[
          { path: "orders", title: "Pedidos" },
          { path: "orders/search", title: "Pesquisar" },
        ]}
      />

      <div className="w-full md:max-w-[600px] mx-auto p-8 flex flex-col gap-4">
        <Alert>
          <QrCode />
          <AlertTitle>Escaneie o QRCode</AlertTitle>
          <AlertDescription>
            Autorize o uso da câmera para isso.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent>
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={(err, result) => {
                if (result && isCuid((result as any).text)) {
                  navigate(
                    `/app/${storeSlug}/orders/v/${(result as any).text}`
                  );
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
