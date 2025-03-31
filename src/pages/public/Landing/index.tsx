import { info } from "@/config/app";
import { GalleryVerticalEnd } from "lucide-react";

export function LandingPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <a
            href="/"
            className="flex items-center gap-2 self-center font-semibold"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            {info.appName}
          </a>
        </div>
      </div>
    </div>
  );
}
