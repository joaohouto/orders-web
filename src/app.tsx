import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

import { Routes } from "@/routes";
import { AuthProvider } from "@/hooks/auth";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Routes />
          <Toaster richColors />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
