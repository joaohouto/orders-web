import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import {
  Crown,
  MailCheck,
  MailX,
  MinusCircle,
  User,
  Verified,
} from "lucide-react";
import dayjs from "dayjs";
import { moneyFormatter } from "@/lib/utils";

export const columns: ColumnDef<any>[] = [
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
        aria-label="Selecionar"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[100px] truncate">
          <span className="truncate">{row.getValue("id")}</span>
        </div>
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue("status")}</span>;
    },
  },

  {
    accessorKey: "buyerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue("buyerName")}</span>;
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => (
      <div className="">
        {dayjs(row.getValue("createdAt")).format("DD MMM YYYY")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[100px] truncate font-medium">
          {moneyFormatter.format(row.getValue("total"))}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
