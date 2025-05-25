import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { CircleXIcon, Loader2 } from "lucide-react";

interface CancelOrderDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CancelOrderDialog({
  orderId,
  open,
  onOpenChange,
  onSuccess,
}: CancelOrderDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleCancelOrder = async () => {
    setLoading(true);

    try {
      await api.patch(`/orders/${orderId}/cancel`);

      onSuccess?.();
      onOpenChange(false);

      toast.success("Pedido cancelado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cancelar pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-balance">
            Tem certeza que deseja cancelar esse pedido?
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground text-center sm:text-left">
          Essa ação não poderá ser desfeita.
        </p>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Voltar
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancelOrder}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <CircleXIcon />}
            Cancelar pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
