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
import Decimal from "decimal.js";
import { Badge } from "@/components/ui/badge";

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
      return (
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("name")}
        </span>
      );
    },
  },

  {
    accessorKey: "variations",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variações" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[100px] truncate font-medium">
          {row.getValue("variations")?.map((variation: any) => (
            <Badge variant="outline" key={variation.id}>
              {variation.name}({moneyFormatter.format(variation.price)})
            </Badge>
          ))}
        </span>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => (
      <div className="">
        {dayjs(row.getValue("createdAt")).format("DD-MM-YYYY")}
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
