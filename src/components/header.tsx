import { Link } from "react-router";
import { CartSidebar } from "./cart/sidebar";
import { info } from "@/config/app";
import { NavUserButton } from "./nav-user";

export function Header() {
  return (
    <div className="w-full flex justify-center border-grid sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full md:w-[1000px] mx-auto p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          <Link to="/">{info.appName}</Link>
        </h1>

        <div className="flex gap-2">
          <CartSidebar />

          <NavUserButton />
        </div>
      </div>
    </div>
  );
}
