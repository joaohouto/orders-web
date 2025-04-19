import { CircleXIcon } from "lucide-react";

export function ErrorPage() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-2 items-center justify-center text-muted-foreground">
      <CircleXIcon />
      <span className="text-sm font-medium text-center">
        Não foi possível carregar a página
      </span>
    </div>
  );
}
