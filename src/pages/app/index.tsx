import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function AppPage() {
  return (
    <div className="min-h-screen bg-muted">
      <div className="w-full md:max-w-[400px] mx-auto my-auto flex flex-col gap-4 px-4 py-8">
        <h1 className="font-semibold tracking-tight text-2xl">Suas lojas</h1>

        <div className="flex flex-col gap-2">
          <Link to="/app/direitoaquidauana">
            <Card>
              <CardHeader>
                <CardTitle>Direito Aquidauana</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <Button>Criar nova loja</Button>
      </div>
    </div>
  );
}
