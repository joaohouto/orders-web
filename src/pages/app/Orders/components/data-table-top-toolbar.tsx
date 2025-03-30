import { Table } from "@tanstack/react-table";
import {
  CirclePlusIcon,
  CircleXIcon,
  DownloadIcon,
  SearchIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { Link, useParams } from "react-router";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { storeSlug } = useParams();

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por comprador"
            value={
              (table.getColumn("buyerName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("buyerName")?.setFilterValue(event.target.value)
            }
            className="w-[150px] lg:w-[250px] pl-8"
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

      <DataTableViewOptions table={table} />

      <Button variant="outline">
        <DownloadIcon />
        Baixar .csv
      </Button>

      <Button asChild>
        <Link to={`/app/${storeSlug}/orders/create`}>
          <CirclePlusIcon />
          Novo
        </Link>
      </Button>
    </div>
  );
}
