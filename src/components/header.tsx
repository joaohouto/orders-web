import { User2 } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { CartSidebar } from "./cart/sidebar";
import { info } from "@/config/app";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <div className="w-full flex justify-center border-grid sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full md:w-[1000px] mx-auto p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{info.appName}</h1>

        <div className="flex gap-2">
          <ThemeToggle />

          <Button variant="outline" asChild>
            <Link to="/profile">
              <User2 /> Seu perfil
            </Link>
          </Button>

          <CartSidebar />
        </div>
      </div>
    </div>
  );
}
