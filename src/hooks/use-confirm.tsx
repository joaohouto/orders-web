import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

type ConfirmOptions = {
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
};

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [resolver, setResolver] = useState<(result: boolean) => void>(
    () => () => {}
  );
  const [options, setOptions] = useState<ConfirmOptions>({});

  function confirm(opts?: ConfirmOptions): Promise<boolean> {
    setOptions(opts || {});
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  }

  function handleCancel() {
    setIsOpen(false);
    resolver(false);
  }

  function handleConfirm() {
    setIsOpen(false);
    resolver(true);
  }

  const dialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options.title || "Tem certeza?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {options.description || "Essa ação não pode ser desfeita."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {options.cancelText || "Cancelar"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {options.confirmText || "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, dialog };
}
