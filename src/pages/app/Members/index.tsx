import { useState } from "react";
import { useParams } from "react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { CheckCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, TrendingUp, Upload, Users, XCircle } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

import { AppHeader } from "@/components/app-header";
import { LoadingPage } from "@/components/page-loading";
import { ErrorPage } from "@/components/page-error";
import { MembershipStatusBadge } from "@/components/membership-status-badge";
import { Button } from "@/components/ui/button";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import api from "@/services/api";
import { moneyFormatter } from "@/lib/utils";
import { AssociationPlan, Membership, MembershipStatus } from "@/types/association";

function parseEmails(raw: string): string[] {
  return raw
    .split(/[\n,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
}

const ACTION_LABELS = {
  created: { label: "Criado", className: "text-green-700 dark:text-green-400" },
  confirmed: { label: "Confirmado", className: "text-blue-700 dark:text-blue-400" },
  skipped: { label: "Pulado", className: "text-muted-foreground" },
} as const;

function BulkImportSheet({ storeSlug }: { storeSlug: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [planId, setPlanId] = useState("");
  const [paymentDate, setPaymentDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [emailsRaw, setEmailsRaw] = useState("");
  const [result, setResult] = useState<null | {
    created: number;
    confirmed: number;
    skipped: number;
    details: { email: string; action: string; reason?: string }[];
  }>(null);
  const [loading, setLoading] = useState(false);

  const { data: plans } = useQuery<AssociationPlan[]>({
    queryKey: [`store-${storeSlug}-association-plans-admin`],
    queryFn: () =>
      api.get(`/stores/${storeSlug}/association-plans`, { params: { all: "true" } }).then((r) => r.data),
    enabled: open,
  });

  const parsedEmails = parseEmails(emailsRaw);

  async function handleSubmit() {
    if (!planId) { toast.error("Selecione um plano"); return; }
    if (parsedEmails.length === 0) { toast.error("Nenhum e-mail válido encontrado"); return; }
    setLoading(true);
    try {
      const { data } = await api.post(`/stores/${storeSlug}/memberships/bulk`, {
        planId,
        paymentDate,
        emails: parsedEmails,
      });
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["memberships", storeSlug] });
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Erro ao importar membros");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setEmailsRaw("");
    setResult(null);
    setPlanId("");
    setPaymentDate(dayjs().format("YYYY-MM-DD"));
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) handleReset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="size-4" />
          Importar membros
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar membros em lote</DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="flex flex-col gap-5 mt-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border p-3">
                <p className="text-2xl font-bold text-green-700">{result.created}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Criados</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-2xl font-bold text-blue-700">{result.confirmed}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Confirmados</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-2xl font-bold text-muted-foreground">{result.skipped}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Pulados</p>
              </div>
            </div>

            <Separator />

            {/* Details */}
            <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
              {result.details.map((d, i) => {
                const config = ACTION_LABELS[d.action as keyof typeof ACTION_LABELS];
                return (
                  <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                    <span className="text-muted-foreground truncate mr-4">{d.email}</span>
                    <div className="flex flex-col items-end shrink-0">
                      <span className={`font-medium text-xs ${config?.className ?? ""}`}>
                        {config?.label ?? d.action}
                      </span>
                      {d.reason && <span className="text-[10px] text-muted-foreground">{d.reason}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full">
              Nova importação
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 mt-6">
            <div className="flex flex-col gap-2">
              <Label>Plano</Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o plano" />
                </SelectTrigger>
                <SelectContent>
                  {(plans ?? []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {moneyFormatter.format(p.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Data do pagamento</Label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>
                E-mails
                {parsedEmails.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {parsedEmails.length} {parsedEmails.length === 1 ? "e-mail encontrado" : "e-mails encontrados"}
                  </span>
                )}
              </Label>
              <Textarea
                placeholder={"joao@exemplo.com\nmaria@exemplo.com\npedro@exemplo.com"}
                value={emailsRaw}
                onChange={(e) => setEmailsRaw(e.target.value)}
                rows={10}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Cole os e-mails separados por linha, vírgula ou ponto-e-vírgula.
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading || parsedEmails.length === 0 || !planId}
            >
              {loading ? "Importando..." : `Importar ${parsedEmails.length > 0 ? parsedEmails.length : ""} membros`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

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
  const [pageIndex, setPageIndex] = useState(0);
  const PAGE_SIZE = 20;

  const queryKey = ["memberships", storeSlug];

  const { data: memberships, isLoading, isError } = useQuery<Membership[]>({
    queryKey,
    queryFn: () => api.get(`/stores/${storeSlug}/memberships`).then((r) => r.data),
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

  const allData = memberships ?? [];

  // Stats
  const activeCount = allData.filter((m) => m.status === "ACTIVE").length;
  const pendingCount = allData.filter((m) => m.status === "PENDING").length;
  const expectedRevenue = allData
    .filter((m) => m.status === "ACTIVE")
    .reduce((sum, m) => sum + Number(m.plan.price), 0);

  // Filtered data
  const filtered = allData.filter((m) => {
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    const matchSearch =
      !search ||
      m.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(pageIndex, pageCount - 1);
  const paginated = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  return (
    <>
      <AppHeader routes={[{ path: "members", title: "Membros" }]} />

      <div className="flex flex-col gap-6 px-8 py-4">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="size-4" />
                Membros ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeCount}</p>
              {pendingCount > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  +{pendingCount} aguardando confirmação
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="size-4" />
                Faturamento esperado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{moneyFormatter.format(expectedRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                por período (membros ativos)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="size-4" />
                Total de registros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{allData.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                histórico completo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-3 flex-1">
            <Input
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPageIndex(0); }}
              className="max-w-sm"
            />
            <Select
              value={statusFilter}
              onValueChange={(v) => { setStatusFilter(v); setPageIndex(0); }}
            >
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
          <BulkImportSheet storeSlug={storeSlug!} />
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum membro encontrado.
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
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
                  {paginated.map((membership) => (
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
                              Confirmar
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
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-sm text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "registro" : "registros"}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setPageIndex(0)} disabled={safePage === 0}>
                  <ChevronsLeft className="size-4" />
                </Button>
                <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setPageIndex((p) => Math.max(0, p - 1))} disabled={safePage === 0}>
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-sm px-2">
                  {safePage + 1} / {pageCount}
                </span>
                <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))} disabled={safePage >= pageCount - 1}>
                  <ChevronRight className="size-4" />
                </Button>
                <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setPageIndex(pageCount - 1)} disabled={safePage >= pageCount - 1}>
                  <ChevronsRight className="size-4" />
                </Button>
              </div>
            </div>
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
