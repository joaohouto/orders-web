import { AppHeader } from "@/components/app-header";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { useParams } from "react-router";
import { LoadingPage } from "@/components/page-loading";
import { ErrorPage } from "@/components/page-error";

export function ProductsPage() {
  const { storeSlug } = useParams();

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  async function getProducts() {
    const res = await api.get(`/stores/${storeSlug}/products`);
    return res.data;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <>
      <AppHeader routes={[{ path: "products", title: "Produtos" }]} />

      <div className="flex flex-col">
        <div className="flex flex-col gap-4 px-8 py-4 ">
          <DataTable data={products.data} columns={columns} />
        </div>
      </div>
    </>
  );
}
