import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import dayjs from "dayjs";

type Product = {
  id: string;
  name: string;
  isActive: boolean;
  variationGroups: {
    name: string;
    variations: { name: string; priceAdjustment: number }[];
  }[];
};

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <div className="flex items-center gap-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
          {!isActive && (
            <Badge variant="secondary" className="shrink-0">
              Inativo
            </Badge>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "variationGroups",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grupos de variação" />
    ),
    cell: ({ row }) => {
      const groups = (row.getValue("variationGroups") as any[]) ?? [];
      const total = groups.reduce((sum, g) => sum + (g.variations?.length ?? 0), 0);
      return <span>{groups.length} {groups.length !== 1 ? "grupos" : "grupo"} / {total} {total !== 1 ? "variações" : "variação"}</span>;
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => (
      <div className="">
        {dayjs(row.getValue("createdAt")).format("DD/MM/YYYY")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
