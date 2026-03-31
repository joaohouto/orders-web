import { info } from "@/config/app";
import { Bird } from "lucide-react";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto max-w-screen-lg px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-semibold text-foreground"
            >
              <Bird className="size-5 text-primary" />
              <span className="tracking-tighter">{info.appName}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A plataforma de vendas universitárias que conecta estudantes às
              melhores lojas do campus.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Comprador</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Meus pedidos
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Meu perfil
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Vendedor</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/app"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Painel
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entrar / Cadastrar
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${info.supportMail}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Suporte
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} {info.appName}. Todos os direitos
            reservados.
          </span>
          <div className="flex items-center gap-4">
            <Link
              to="/termos"
              className="hover:text-foreground transition-colors"
            >
              Termos de Uso
            </Link>
            <Link
              to="/privacidade"
              className="hover:text-foreground transition-colors"
            >
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
