import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import dayjs from "dayjs";
import { moneyFormatter } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { Link, useParams } from "react-router";

const orderStatuses = {
  PENDING: "PENDENTE",
  CONFIRMED: "CONFIRMADO",
  IN_PRODUCTION: "EM PRODUÇÃO",
  READY: "PRONTO",
  DELIVERED: "ENTREGUE",
  CANCELED: "CANCELADO",
};

type OrderStatus = keyof typeof orderStatuses;

type Order = {
  id: string;
  code: number;
  storeId: string;
  userId: string;
  user: {
    name: string;
  };
  status: OrderStatus;
  totalPrice: string;
  createdAt: Date;
  updatedAt: Date;
};

export const columns: ColumnDef<Order>[] = [
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
      <DataTableColumnHeader column={column} title="Pedido" />
    ),
    cell: ({ row }) => {
      const { storeSlug } = useParams();

      return (
        <div className="font-mono">
          <Link
            to={`/app/${storeSlug}/orders/v/${row.getValue("id")}`}
            className="text-sm font-medium"
          >
            #{(row.original as Order).code}
          </Link>
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
      return (
        <OrderStatusBadge status={row.getValue("status") as OrderStatus} />
      );
    },
  },

  {
    accessorKey: "buyerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comprador" />
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
        {dayjs(row.getValue("createdAt")).format("DD-MM-YYYY")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[100px] truncate font-medium">
          {moneyFormatter.format(+(row.getValue("totalPrice") as string))}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
