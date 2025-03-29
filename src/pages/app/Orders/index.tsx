import { AppHeader } from "@/components/app-header";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign } from "lucide-react";
import { moneyFormatter } from "@/lib/utils";

export function OrdersPage() {
  const orders = [
    {
      id: "acde070d-8c4c-4f0d-9d8a-162843c10333",
      status: "NOT_PAYED", // NOT_PAYED, PAYED, PREPARING, DELIVERED, USER_CANCELLED
      total: 120,

      buyerName: "João Henrique Martins Couto",
      buyerPhone: "(67) 9 9237-8640",

      items: [
        {
          name: "Camiseta",
          price: 120,
          quantity: 1,
          selectedVariation: {
            name: "Tamanho G",
            price: 120,
          },
          buyerComments: "Adicionar número de costas 10",
        },
      ],
    },
  ];

  return (
    <>
      <AppHeader routes={[{ path: "orders", title: "Pedidos" }]} />

      <div className="flex flex-col gap-8 px-8 py-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex items-center justify-between pb-0">
              <CardTitle className="text-sm font-medium">
                Total de vendas
              </CardTitle>
              <DollarSign className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {moneyFormatter.format(1000)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-0">
              <CardTitle className="text-sm font-medium">Vendas</CardTitle>
              <CreditCard className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+20</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <DataTable data={orders} columns={columns} />
        </div>
      </div>
    </>
  );
}
