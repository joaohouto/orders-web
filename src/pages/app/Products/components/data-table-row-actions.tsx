import { Row } from "@tanstack/react-table";
import {
  ArrowUpRight,
  EditIcon,
  Loader2Icon,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import api from "@/services/api";
import { useConfirm } from "@/hooks/use-confirm";
import { useQueryClient } from "@tanstack/react-query";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const rowItem = row.original;

  const [loadingDelete, setLoadingDelete] = useState(false);
  const { confirm, dialog } = useConfirm();
  const { storeSlug } = useParams();

  const queryClient = useQueryClient();

  async function deleteRow(id: string) {
    setLoadingDelete(false);
    try {
      const ok = await confirm({
        title: "Confirmar exclusão",
        description: "Tem certeza que quer deletar isso?",
        cancelText: "Voltar",
        confirmText: "Deletar",
      });

      if (!ok) return;

      await api.delete(`/products/${id}`);
      await queryClient.invalidateQueries({ queryKey: ["products"] });

      toast.success("Excluído!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir!");
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem asChild>
            <Link to={`/${storeSlug}/p/${rowItem.slug}`}>
              <ArrowUpRight />
              Ver produto
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to={`/app/${storeSlug}/products/e/${rowItem.slug}`}>
              <EditIcon />
              Editar produto
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              className="w-full"
              disabled={loadingDelete}
              onClick={() => deleteRow(rowItem.id)}
            >
              {loadingDelete ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <Trash2 />
              )}
              Excluir produto
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {dialog}
    </>
  );
}
