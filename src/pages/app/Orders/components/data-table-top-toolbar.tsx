import { Table } from "@tanstack/react-table";
import {
  CameraIcon,
  CircleXIcon,
  DownloadIcon,
  FilterIcon,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const orderStatuses = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  IN_PRODUCTION: "Em produção",
  READY: "Pronto",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

type StatusKey = keyof typeof orderStatuses;

const today = new Date().toISOString().split("T")[0];

interface ExportFilters {
  startDate: string;
  endDate: string;
  status: StatusKey[];
  buyerName: string;
}

const initialExportFilters: ExportFilters = {
  startDate: "",
  endDate: "",
  status: [],
  buyerName: "",
};

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [loadingExport, setLoadingExport] = useState(false);
  const [showExportFilters, setShowExportFilters] = useState(false);
  const [exportFilters, setExportFilters] = useState<ExportFilters>(initialExportFilters);
  const [dateError, setDateError] = useState("");
  const [batchStatus, setBatchStatus] = useState<StatusKey | "">("");
  const [loadingBatch, setLoadingBatch] = useState(false);

  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  const { storeSlug } = useParams();

  function handleToggleStatus(s: StatusKey, checked: boolean) {
    setExportFilters((f) => ({
      ...f,
      status: checked ? [...f.status, s] : f.status.filter((x) => x !== s),
    }));
  }

  function handleEndDateChange(value: string) {
    setExportFilters((f) => ({ ...f, endDate: value }));
    if (exportFilters.startDate && value && value < exportFilters.startDate) {
      setDateError("A data final deve ser maior ou igual à data inicial.");
    } else {
      setDateError("");
    }
  }

  function handleStartDateChange(value: string) {
    setExportFilters((f) => ({ ...f, startDate: value }));
    if (exportFilters.endDate && value && exportFilters.endDate < value) {
      setDateError("A data final deve ser maior ou igual à data inicial.");
    } else {
      setDateError("");
    }
  }

  function clearExportFilters() {
    setExportFilters(initialExportFilters);
    setDateError("");
  }

  async function exportCSV() {
    if (dateError) return;
    if (
      exportFilters.startDate &&
      exportFilters.endDate &&
      exportFilters.endDate < exportFilters.startDate
    ) {
      setDateError("A data final deve ser maior ou igual à data inicial.");
      return;
    }

    setLoadingExport(true);
    try {
      const params = new URLSearchParams();
      if (exportFilters.startDate) params.set("startDate", exportFilters.startDate);
      if (exportFilters.endDate) params.set("endDate", exportFilters.endDate);
      exportFilters.status.forEach((s) => params.append("status", s));
      if (exportFilters.buyerName.trim()) params.set("buyerName", exportFilters.buyerName.trim());

      const res = await api.get(
        `/stores/${storeSlug}/orders/export?${params.toString()}`,
        { responseType: "blob" }
      );

      const disposition = res.headers["content-disposition"] as string | undefined;
      let filename = `pedidos-${storeSlug}.csv`;
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Dados exportados!");
    } catch (err: any) {
      console.log(err);
      const message = err?.response?.data?.error ?? "Erro ao exportar pedidos";
      toast.error(message);
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
              placeholder="Pesquisar por comprador ou código"
              value={(table.getState().globalFilter as string) ?? ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="w-full md:w-[250px] pl-8"
            />
          </div>

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters();
                table.setGlobalFilter("");
              }}
              className="px-2 lg:px-3"
            >
              Limpar
              <CircleXIcon />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={showExportFilters ? "secondary" : "outline"}
            onClick={() => setShowExportFilters((v) => !v)}
          >
            <FilterIcon />
            Filtros de exportação
          </Button>

          <Button variant="outline" onClick={exportCSV} disabled={loadingExport || !!dateError}>
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

      {showExportFilters && (
        <div className="flex flex-col gap-4 p-4 rounded-lg border bg-muted/30 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Filtros de exportação</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-7 px-2"
              onClick={clearExportFilters}
            >
              <CircleXIcon className="size-3.5" />
              Limpar filtros
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Data início */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Data inicial</Label>
              <Input
                type="date"
                max={today}
                value={exportFilters.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            {/* Data fim */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Data final</Label>
              <Input
                type="date"
                max={today}
                min={exportFilters.startDate || undefined}
                value={exportFilters.endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            {/* Nome do cliente */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Cliente</Label>
              <Input
                type="text"
                placeholder="Filtrar por cliente"
                value={exportFilters.buyerName}
                onChange={(e) =>
                  setExportFilters((f) => ({ ...f, buyerName: e.target.value }))
                }
                className="h-8 text-sm"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {(Object.entries(orderStatuses) as [StatusKey, string][]).map(
                  ([key, label]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <Checkbox
                        id={`export-status-${key}`}
                        checked={exportFilters.status.includes(key)}
                        onCheckedChange={(checked) =>
                          handleToggleStatus(key, !!checked)
                        }
                        className="size-3.5"
                      />
                      <label
                        htmlFor={`export-status-${key}`}
                        className="text-xs cursor-pointer"
                      >
                        {label}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {dateError && (
            <p className="text-xs text-destructive">{dateError}</p>
          )}
        </div>
      )}

      {hasSelection && (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50 animate-in fade-in slide-in-from-top-1">
          <span className="text-sm text-muted-foreground font-medium">
            {selectedRows.length} selecionado(s)
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Select
              value={batchStatus}
              onValueChange={(v) => setBatchStatus(v as StatusKey)}
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
