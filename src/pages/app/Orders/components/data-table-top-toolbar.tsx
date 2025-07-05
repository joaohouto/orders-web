import { Table } from "@tanstack/react-table";
import {
  CameraIcon,
  CirclePlusIcon,
  CircleXIcon,
  DownloadIcon,
  Loader2,
  SearchIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import api from "@/services/api";
import { useState } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [loadingExport, setLoadingExport] = useState(false);

  const isFiltered = table.getState().columnFilters.length > 0;

  const { storeSlug } = useParams();

  async function exportCSV() {
    setLoadingExport(true);
    try {
      const res = await api.get(`/stores/${storeSlug}/orders/export`, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `pedidos-${storeSlug}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Dados exportados!");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao exportar");
    } finally {
      setLoadingExport(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por comprador"
            value={
              (table.getColumn("buyerName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("buyerName")?.setFilterValue(event.target.value)
            }
            className="w-full md:w-[250px] pl-8"
          />
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="px-2 lg:px-3"
          >
            Limpar
            <CircleXIcon />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={exportCSV} disabled={loadingExport}>
          {loadingExport ? (
            <Loader2 className="animate-spin" />
          ) : (
            <DownloadIcon />
          )}
          Baixar .csv
        </Button>

        <Button variant="outline" asChild>
          <Link to={`/app/${storeSlug}/orders/find`}>
            <CameraIcon />
            Encontrar pedido
          </Link>
        </Button>
      </div>
    </div>
  );
}
