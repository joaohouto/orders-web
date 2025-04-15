import { AppHeader } from "@/components/app-header";

import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";

import { LoadingPage } from "@/components/page-loading";
import { ErrorPage } from "@/components/page-error";

import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export function ProductsPage() {
  const { storeSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const q = searchParams.get("q") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { page, limit, q }],
    queryFn: () => fetchProducts({ page, limit, q }),
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString(), q });
  };

  async function fetchProducts({
    page,
    limit,
    q,
  }: {
    page: number;
    limit: number;
    q?: string;
  }) {
    const response = await api.get(`/stores/${storeSlug}/products`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        ...(q ? { q } : {}),
      },
    });

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
      <AppHeader routes={[{ path: "products", title: "Produtos" }]} />

      <div className="flex flex-col">
        <div className="flex flex-col gap-4 px-8 py-4 ">
          <DataTable data={data.data} columns={columns} />
        </div>
      </div>
    </>
  );
}
