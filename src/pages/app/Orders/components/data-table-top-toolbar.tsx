import { Table } from "@tanstack/react-table";
import {
  CameraIcon,
  CircleXIcon,
  DownloadIcon,
  Loader2,
  SearchIcon,
  RefreshCwIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import api from "@/services/api";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const orderStatuses = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  IN_PRODUCTION: "Em produção",
  READY: "Pronto",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [loadingExport, setLoadingExport] = useState(false);
  const [batchStatus, setBatchStatus] = useState<keyof typeof orderStatuses | "">("");
  const [loadingBatch, setLoadingBatch] = useState(false);

  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

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

  async function applyBatchStatus() {
    if (!batchStatus || selectedRows.length === 0) return;

    setLoadingBatch(true);
    try {
      await Promise.all(
        selectedRows.map((row: any) =>
          api.patch(`/orders/${row.original.id}/status`, { status: batchStatus })
        )
      );
      toast.success(`${selectedRows.length} pedido(s) atualizado(s)!`);
      table.resetRowSelection();
      setBatchStatus("");
    } catch {
      toast.error("Erro ao atualizar pedidos");
    } finally {
      setLoadingBatch(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
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

        <div className="flex items-center gap-3">
        <Button variant="outline" onClick={exportCSV} disabled={loadingExport}>
          {loadingExport ? (
            <Loader2 className="animate-spin" />
          ) : (
            <DownloadIcon />
          )}
          Exportar .csv
        </Button>

        <Button variant="outline" asChild>
          <Link to={`/app/${storeSlug}/orders/find`}>
            <CameraIcon />
            Encontrar pedido
          </Link>
        </Button>
        </div>
      </div>

      {hasSelection && (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50 animate-in fade-in slide-in-from-top-1">
          <span className="text-sm text-muted-foreground font-medium">
            {selectedRows.length} selecionado(s)
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Select
              value={batchStatus}
              onValueChange={(v) => setBatchStatus(v as keyof typeof orderStatuses)}
            >
              <SelectTrigger className="h-8 w-[160px] text-sm">
                <SelectValue placeholder="Novo status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(orderStatuses).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              disabled={!batchStatus || loadingBatch}
              onClick={applyBatchStatus}
            >
              {loadingBatch ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RefreshCwIcon className="size-3.5" />
              )}
              Aplicar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => table.resetRowSelection()}
              className="text-muted-foreground"
            >
              <CircleXIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
