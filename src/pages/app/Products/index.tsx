import { AppHeader } from "@/components/app-header";

import api from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import { LoadingPage } from "@/components/page-loading";
import { ErrorPage } from "@/components/page-error";

import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { toast } from "sonner";

export function ProductsPage() {
  const { storeSlug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", storeSlug],
    queryFn: () =>
      api
        .get(`/stores/${storeSlug}/products`, { params: { includeInactive: "true" } })
        .then((res) => res.data),
  });

  const reorderMutation = useMutation({
    mutationFn: (productIds: string[]) =>
      api.patch(`/stores/${storeSlug}/products/reorder`, { productIds }),
    onError: () => {
      toast.error("Erro ao salvar nova ordem");
      queryClient.invalidateQueries({ queryKey: ["products", storeSlug] });
    },
  });

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
        <div className="flex flex-col gap-4 px-8 py-4">
          <DataTable
            data={data.data}
            columns={columns}
            showPagination={false}
            onRowClick={(row: any) =>
              navigate(`/app/${storeSlug}/products/e/${row.slug}`)
            }
            getRowId={(row: any) => row.id}
            onReorder={(ids) => reorderMutation.mutate(ids)}
          />
        </div>
      </div>
    </>
  );
}
