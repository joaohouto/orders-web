import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlusIcon } from "lucide-react";

export function CreateStoreButton({
  onCreateStore,
}: {
  onCreateStore: () => any;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center justify-center gap-2 mt-6">
          <CirclePlusIcon className="h-4 w-4" />
          Criar nova loja
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar nova loja</DialogTitle>
          <DialogDescription>Venda seus produtos com ela!</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              URL
            </Label>
            <Input id="username" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Criar nova loja</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
