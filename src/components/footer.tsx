import { info } from "@/config/app";
import { Bird } from "lucide-react";
import { Link } from "react-router";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-dashed bg-background">
      <div className="mx-auto max-w-screen-lg px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="space-y-3 col-span-1 lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-muted-foreground"
            >
              <Bird className="size-5" />
              <span className="tracking-tighter text-md">{info.appName}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A plataforma de vendas universitárias que conecta estudantes às
              melhores lojas do campus.
            </p>
          </div>

          <div />

          <div className="space-y-3">
            <h3 className="font-medium">Navegação</h3>
            <ul className="space-y-1">
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
                  Seus pedidos
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Suas informações
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Legal</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="https://joaocouto.com/politica-de-privacidade"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  to="https://joaocouto.com/politica-de-privacidade"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${info.supportMail}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {info.supportMail}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} vendeuu. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
}
