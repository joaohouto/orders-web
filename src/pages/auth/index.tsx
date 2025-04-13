import { GoogleIcon } from "@/components/google-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { info } from "@/config/app";
import { useAuth } from "@/hooks/auth";
import { API_URL } from "@/services/api";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router";

export function AuthPage() {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [searchParams] = useSearchParams();

  const { saveToken, user } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      saveToken({ token });
    }
  }, []);

  function handleLogin() {
    setLoadingSubmit(true);
    window.location.href = `${API_URL}/auth/google`;
  }

  if (user) {
    const redirectTo = localStorage.getItem("@Orders:AuthRedirectsTo");

    return <Navigate to={redirectTo || "/profile"} replace />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 self-center font-semibold mb-2 tracking-tighter">
                <info.appIcon />
                {info.appName}
              </div>

              <CardTitle className="text-xl">Seja bem-vindo</CardTitle>
              <CardDescription>
                Por favor, autentique-se antes de qualquer coisa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleLogin}
                variant="outline"
                className="w-full"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Entrar com Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
