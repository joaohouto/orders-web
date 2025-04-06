import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

import { Routes } from "@/routes";
import { AuthProvider } from "@/hooks/auth";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Routes />
        <Toaster richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}
