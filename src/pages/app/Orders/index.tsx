import { AppHeader } from "@/components/app-header";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

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
        <div className="flex flex-col gap-4">
          <DataTable data={orders} columns={columns} />
        </div>
      </div>
    </>
  );
}
