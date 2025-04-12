import { AppHeader } from "@/components/app-header";
import { ErrorPage } from "@/components/page-error";
import { LoadingPage } from "@/components/page-loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/auth";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { CirclePlusIcon, CircleXIcon, SendIcon, User2 } from "lucide-react";
import { useParams } from "react-router";
import { toast } from "sonner";

export function TeamPage() {
  const { storeSlug } = useParams();

  const { user } = useAuth();

  const {
    data: collaborators,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`${storeSlug}-collaborators`],
    queryFn: getCollaborators,
  });

  async function getCollaborators() {
    const res = await api.get(`/stores/${storeSlug}/collaborators`);
    return res.data;
  }

  async function changeCollaboratorRole(userId: string, role: string) {
    try {
      await api.patch(`/stores/${storeSlug}/collaborators/${userId}/role`, {
        role,
      });

      toast.success("Permissão alterada");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao alterar permissão");
    }
  }

  async function deleteCollaborator(userId: string) {
    try {
      await api.delete(`/stores/${storeSlug}/collaborators/${userId}`);

      toast.success("Colaborador removido");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao remover");
    }
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <>
      <AppHeader routes={[{ path: "/team", title: "Colaboradores" }]} />

      <div className="w-full md:max-w-[600px] mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>Sua equipe</CardTitle>
            <CardDescription>
              Gerencie quem tem acesso de administração para sua página.
            </CardDescription>

            <div className="mt-4 grid grid-cols-[1fr_auto] gap-4">
              <Input placeholder="email@exemplo.com" />
              <Button>
                Adicionar <CirclePlusIcon />
              </Button>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Label>Pessoas com acesso</Label>
            </div>

            {collaborators.map((collaborator: any) => (
              <div
                className="grid grid-cols-[36px_1fr_auto_auto] gap-4 items-center"
                key={collaborator.id}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={collaborator.avatar} alt="Avatar" />
                  <AvatarFallback>
                    <User2 className="size-4" />
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm font-medium leading-none">
                    {collaborator.name}
                    {collaborator.userId === user.id && " (você)"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {collaborator.email}
                  </p>
                </div>

                <Select
                  defaultValue={collaborator.role}
                  disabled={collaborator.role === "OWNER"}
                  onValueChange={(value: string) =>
                    changeCollaboratorRole(collaborator.userId, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um modo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Pode</SelectLabel>
                      <SelectItem value="VIEW">Ler</SelectItem>
                      <SelectItem value="EDIT">Editar</SelectItem>
                      <SelectItem value="OWNER" disabled>
                        Gerenciar
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {collaborator.userId !== user.id && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteCollaborator(collaborator.userId)}
                  >
                    <CircleXIcon />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
