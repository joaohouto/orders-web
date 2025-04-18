import { AppHeader } from "@/components/app-header";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { LoadingPage } from "@/components/page-loading";
import { ErrorPage } from "@/components/page-error";
import { useParams } from "react-router";

export function OrdersPage() {
  const { storeSlug } = useParams();

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  async function fetchOrders() {
    const response = await api.get(`/stores/${storeSlug}/orders`);
    return response.data;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

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
