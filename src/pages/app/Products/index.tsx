import { AppHeader } from "@/components/app-header";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export function ProductsPage() {
  const products = [
    {
      name: "CAMISA FUTEBOL AMERICANO",
      price: 90,
      image:
        "https://www.cataventouniformes.com.br/wp-content/uploads/2024/09/camisa-de-futebol-americano-premium-personalizada.png",
      isActive: true,
    },
  ];

  return (
    <>
      <AppHeader routes={[{ path: "products", title: "Produtos" }]} />

      <div className="flex flex-col">
        <div className="flex flex-col gap-4 px-8 py-4 ">
          <DataTable data={products} columns={columns} />
        </div>
      </div>
    </>
  );
}
