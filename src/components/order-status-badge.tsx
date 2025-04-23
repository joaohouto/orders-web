import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle,
  Factory,
  Package,
  Truck,
  XCircle,
  ShoppingBag,
} from "lucide-react";

export const orderStatuses = {
  PENDING: "PENDENTE",
  CONFIRMED: "CONFIRMADO",
  IN_PRODUCTION: "EM PRODUÇÃO",
  READY: "PRONTO",
  DELIVERED: "ENTREGUE",
  CANCELED: "CANCELADO",
} as const;

export type OrderStatus = keyof typeof orderStatuses;

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const statusStyles = {
    PENDING:
      "bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900/50",
    CONFIRMED:
      "bg-green-100 border-green-200 text-green-800 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/50",
    IN_PRODUCTION:
      "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-800",
    READY:
      "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-800",
    DELIVERED:
      "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-800",
    CANCELED:
      "bg-red-100 border-red-200 text-red-800 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/50",
  };

  const StatusIcon = {
    PENDING: Clock,
    CONFIRMED: CheckCircle,
    IN_PRODUCTION: ShoppingBag,
    READY: Package,
    DELIVERED: Truck,
    CANCELED: XCircle,
  }[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border-2 flex items-center gap-1.5",
        statusStyles[status],
        className
      )}
    >
      <StatusIcon className="h-3.5 w-3.5" />
      {orderStatuses[status]}
    </Badge>
  );
}
