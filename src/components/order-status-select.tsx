import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import api from "@/services/api";
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  XCircle,
  ShoppingBag,
  Loader2,
} from "lucide-react";

const orderStatuses = {
  PENDING: "PENDENTE",
  CONFIRMED: "CONFIRMADO",
  IN_PRODUCTION: "EM PRODUÇÃO",
  READY: "PRONTO",
  DELIVERED: "ENTREGUE",
  CANCELED: "CANCELADO",
};

const statusIcons = {
  PENDING: { Icon: Clock, className: "text-amber-600" },
  CONFIRMED: { Icon: CheckCircle, className: "text-green-600" },
  IN_PRODUCTION: { Icon: ShoppingBag, className: "text-gray-600" },
  READY: { Icon: Package, className: "text-gray-600" },
  DELIVERED: { Icon: Truck, className: "text-gray-600" },
  CANCELED: { Icon: XCircle, className: "text-red-600" },
} as const;

export function OrderStatusSelect({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: keyof typeof orderStatuses;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newStatus: keyof typeof orderStatuses) => {
      if (!confirm("Alterar status?")) return;

      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      return newStatus;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`order-${orderId}`] });
    },
    onError: (err) => {
      console.error("Erro ao atualizar status:", err);
    },
  });

  return (
    <div className="flex items-center gap-2">
      <Select
        value={initialStatus}
        onValueChange={(value) =>
          mutation.mutate(value as keyof typeof orderStatuses)
        }
        disabled={mutation.isPending}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecionar status" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(orderStatuses).map(([key, label]) => {
            const { Icon, className } =
              statusIcons[key as keyof typeof statusIcons];
            return (
              <SelectItem key={key} value={key}>
                <span className="flex items-center gap-2">
                  <Icon className={`size-4 ${className}`} />
                  {label}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {mutation.isPending && (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
