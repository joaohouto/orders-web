import { Link } from "react-router";
import { CartSidebar } from "./cart/sidebar";
import { info } from "@/config/app";
import { NavUserButton } from "./nav-user";

export function Header() {
  return (
    <div className="w-full flex justify-center border-grid sticky top-0 z-50 border-b border-dashed bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full md:w-[1000px] mx-auto p-4 flex items-center justify-between">
        <h1 className="text-md font-bold tracking-tighter">
          <Link to="/" className="flex gap-2 items-center text-primary">
            <info.appIcon />
            <span className="bg-[linear-gradient(to_right,#EE0979,#FF6A00)] bg-clip-text text-transparent">
              {info.appName}
            </span>
          </Link>
        </h1>

        <div className="flex gap-2">
          <CartSidebar />
          <NavUserButton />
        </div>
      </div>
    </div>
  );
}
