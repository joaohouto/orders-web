import { User2 } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { CartSidebar } from "./cart/sidebar";
import { info } from "@/config/app";

export function Header() {
  return (
    <div className="w-full md:max-w-[680px] mx-auto p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">{info.appName}</h1>

      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link to="/profile">
            <User2 /> Perfil
          </Link>
        </Button>

        <CartSidebar />
      </div>
    </div>
  );
}
