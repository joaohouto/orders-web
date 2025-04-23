import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import api from "@/services/api";

const orderStatuses = {
  PENDING: "PENDENTE",
  CONFIRMED: "CONFIRMADO",
  IN_PRODUCTION: "EM PRODUÇÃO",
  READY: "PRONTO",
  DELIVERED: "ENTREGUE",
  CANCELED: "CANCELADO",
};

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
        {Object.entries(orderStatuses).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
