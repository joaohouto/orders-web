import { Row } from "@tanstack/react-table";
import { ArrowUpRight, EditIcon, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const rowItem = row.original;

  const { storeSlug } = useParams();

  async function deleteRow(id: string) {
    try {
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir!");
    }
  }

  return (
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
          <Link to={`/app/${storeSlug}/products/e/${rowItem.id}`}>
            <Trash2 />
            Excluir produto
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
