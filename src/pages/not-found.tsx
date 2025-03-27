import { ArrowUpRight, Bird } from "lucide-react";
import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-2 bg-muted">
      <Bird className="h-12 w-12 text-muted-foreground" />
      <span className="text-base font-semibold text-muted-foreground">
        Página não encontrada.
      </span>
      <Link to="/" className="flex gap-1 items-center text-blue-500 text-sm">
        Voltar ao início <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}
