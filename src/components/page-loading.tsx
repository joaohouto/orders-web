import { Loader2 } from "lucide-react";

export function LoadingPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
