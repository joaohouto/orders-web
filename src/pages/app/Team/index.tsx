import { AppHeader } from "@/components/app-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { SendIcon } from "lucide-react";
import { useParams } from "react-router";

export function TeamPage() {
  const { storeSlug } = useParams();

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
                Convidar <SendIcon />
              </Button>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Label>Pessoas com acesso</Label>
            </div>

            <div className="grid grid-cols-[36px_1fr_auto] gap-4 items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>HS</AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-medium leading-none">Helem Sanche</p>
                <p className="text-sm text-muted-foreground">
                  helem.sanche@gmail.com
                </p>
              </div>

              <Select defaultValue="viewer">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Poderes de</SelectLabel>
                    <SelectItem value="viewer">Leitura</SelectItem>
                    <SelectItem value="editor">Edição</SelectItem>
                    <SelectItem value="admin" disabled>
                      Administração
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-[36px_1fr_auto] gap-4 items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>JH</AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-medium leading-none">
                  João Henrique (você)
                </p>
                <p className="text-sm text-muted-foreground">
                  joaocouto.jar@gmail.com
                </p>
              </div>

              <Select defaultValue="viewer">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Poderes de</SelectLabel>
                    <SelectItem value="viewer">Leitura</SelectItem>
                    <SelectItem value="editor">Edição</SelectItem>
                    <SelectItem value="admin" disabled>
                      Administração
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
