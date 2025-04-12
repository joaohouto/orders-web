import {
  CreditCardIcon,
  GalleryHorizontalEnd,
  HelpCircle,
  LogOutIcon,
  Menu,
  Moon,
  MoreVerticalIcon,
  Sun,
  User2Icon,
  UserCircleIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/hooks/auth";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";

export function NavUserButton() {
  const { user, signOut } = useAuth();
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <Menu />
          Menu
        </Button>
      </DropdownMenuTrigger>
      {user ? (
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="bottom"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  <User2Icon className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/orders">
                <GalleryHorizontalEnd />
                Seus pedidos
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to="/profile">
                <UserCircleIcon />
                Seu perfil
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <a href="mailto:suporte@joaocouto.com" target="_blank">
                <HelpCircle />
                Precisa de ajuda?
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DropdownMenuItem>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                Mudar tema
              </DropdownMenuItem>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Claro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Escuro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOutIcon />
            Encerrar sessão
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="bottom"
          sideOffset={4}
        >
          <Button className="w-full" variant="outline" asChild>
            <Link to="/auth">
              <User2Icon />
              Fazer login
            </Link>
          </Button>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
