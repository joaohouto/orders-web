import { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

import { AppHeader } from "@/components/app-header";
import { LoadingPage } from "@/components/page-loading";
import { ErrorPage } from "@/components/page-error";
import { MembershipStatusBadge } from "@/components/membership-status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";

import api from "@/services/api";
import { moneyFormatter } from "@/lib/utils";
import { Membership, MembershipStatus } from "@/types/association";

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Todos os status" },
  { value: "PENDING", label: "Pendentes" },
  { value: "ACTIVE", label: "Ativos" },
  { value: "EXPIRED", label: "Expirados" },
  { value: "CANCELED", label: "Cancelados" },
];

export function MembersPage() {
  const { storeSlug } = useParams();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const queryKey = ["memberships", storeSlug];

  const { data: memberships, isLoading, isError } = useQuery<Membership[]>({
    queryKey,
    queryFn: () =>
      api.get(`/stores/${storeSlug}/memberships`).then((r) => r.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MembershipStatus }) =>
      api.patch(`/memberships/${id}/status`, { status }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Status atualizado");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error ?? "Erro ao atualizar status");
    },
  });

  const filtered = (memberships ?? []).filter((m) => {
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    const matchSearch =
      !search ||
      m.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  const pendingCount = memberships?.filter((m) => m.status === "PENDING").length ?? 0;
  const activeCount = memberships?.filter((m) => m.status === "ACTIVE").length ?? 0;

  return (
    <>
      <AppHeader routes={[{ path: "members", title: "Membros" }]} />

      <div className="flex flex-col gap-6 px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {activeCount} ativos
            </span>
            {pendingCount > 0 && (
              <Badge variant="secondary">
                {pendingCount} aguardando confirmação
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum membro encontrado.
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membro</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vigência</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((membership) => (
                  <TableRow key={membership.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{membership.user?.name ?? "—"}</p>
                        <p className="text-sm text-muted-foreground">{membership.user?.email}</p>
                        {membership.user?.phone && (
                          <p className="text-xs text-muted-foreground">{membership.user.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{membership.plan.name}</TableCell>
                    <TableCell>
                      <MembershipStatusBadge status={membership.status} />
                    </TableCell>
                    <TableCell>
                      {membership.startDate && membership.endDate ? (
                        <div className="text-sm">
                          <p>{dayjs(membership.startDate).format("DD/MM/YYYY")}</p>
                          <p className="text-muted-foreground">
                            até {dayjs(membership.endDate).format("DD/MM/YYYY")}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{moneyFormatter.format(membership.plan.price)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {membership.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-700 border-green-200 hover:bg-green-50"
                            onClick={() =>
                              updateStatusMutation.mutate({ id: membership.id, status: "ACTIVE" })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            <CheckCircle className="size-4" />
                            Confirmar pagamento
                          </Button>
                        )}
                        {(membership.status === "PENDING" || membership.status === "ACTIVE") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setCancelingId(membership.id)}
                          >
                            <XCircle className="size-4" />
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog open={!!cancelingId} onOpenChange={(o) => !o && setCancelingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar associação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta associação? O membro perderá o acesso imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                cancelingId &&
                updateStatusMutation.mutate({ id: cancelingId, status: "CANCELED" }, {
                  onSettled: () => setCancelingId(null),
                })
              }
            >
              Cancelar associação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
