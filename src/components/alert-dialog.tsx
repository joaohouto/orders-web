"use client";

import { createRoot } from "react-dom/client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

export function alertDialog(message: string): Promise<void> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    const handleClose = () => {
      root.unmount();
      container.remove();
      resolve();
    };

    root.render(
      <AlertDialog open>
        <AlertDialogContent className="!max-w-[400px]">
          <AlertDialogHeader className="flex gap-2 items-center sm:items-start">
            <AlertCircle className="text-muted-foreground" />
            <AlertDialogTitle>{message}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleClose}>Ok</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  });
}
