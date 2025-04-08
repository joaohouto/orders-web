import { Bird } from "lucide-react";

export function ErrorPage() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-2 items-center justify-center text-muted-foreground">
      <Bird />
      <span className="text-sm font-medium">
        Algo deu errado ao carregar a página
      </span>
    </div>
  );
}
