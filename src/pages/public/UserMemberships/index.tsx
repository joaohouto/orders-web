import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CircleX,
  Clock,
  RefreshCw,
  TriangleAlert,
  Users,
} from "lucide-react";
import dayjs from "dayjs";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { MembershipStatusBadge } from "@/components/membership-status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import api from "@/services/api";
import { moneyFormatter } from "@/lib/utils";
import { Membership } from "@/types/association";

const DURATION_LABELS: Record<number, string> = {
  1: "mensal",
  6: "semestral",
  12: "anual",
};

const EXPIRING_SOON_DAYS = 7;

function daysUntil(date: string) {
  return dayjs(date).diff(dayjs(), "day");
}

type StoreGroup = {
  storeId: string;
  storeName: string;
  storeSlug: string;
  storeIcon?: string;
  memberships: Membership[];
};

function groupByStore(memberships: Membership[]): StoreGroup[] {
  const map = new Map<string, StoreGroup>();

  for (const m of memberships) {
    if (!m.store) continue;
    if (!map.has(m.storeId)) {
      map.set(m.storeId, {
        storeId: m.storeId,
        storeName: m.store.name,
        storeSlug: m.store.slug,
        storeIcon: m.store.icon,
        memberships: [],
      });
    }
    map.get(m.storeId)!.memberships.push(m);
  }

  return Array.from(map.values());
}

function StoreSection({ group, onNavigate }: { group: StoreGroup; onNavigate: (path: string) => void }) {
  const sorted = [...group.memberships].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const current = sorted.find((m) => m.status === "ACTIVE" || m.status === "PENDING");
  const history = sorted.filter((m) => m !== current);

  const isExpiringSoon =
    current?.status === "ACTIVE" &&
    current.endDate &&
    daysUntil(current.endDate) <= EXPIRING_SOON_DAYS &&
    daysUntil(current.endDate) >= 0;

  const confirmedPayments = sorted.filter(
    (m) => m.status === "ACTIVE" || m.status === "EXPIRED",
  );

  return (
    <Card>
      {/* Store header */}
      <CardHeader className="pb-3">
        <button
          className="flex items-center gap-3 text-left group w-full"
          onClick={() => onNavigate(`/${group.storeSlug}`)}
        >
          {group.storeIcon ? (
            <img
              src={group.storeIcon}
              alt={group.storeName}
              className="size-10 rounded-lg border object-cover shrink-0"
            />
          ) : (
            <div className="size-10 rounded-lg border bg-muted flex items-center justify-center shrink-0">
              <Users className="size-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate group-hover:underline">
              {group.storeName}
            </p>
            <p className="text-xs text-muted-foreground">{group.memberships.length} {group.memberships.length === 1 ? "associação" : "associações"} no histórico</p>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 flex flex-col gap-4">
        {/* Expiring soon alert */}
        {isExpiringSoon && (
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
            <TriangleAlert className="size-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">
              {daysUntil(current!.endDate!) === 0
                ? "Sua associação expira hoje!"
                : `Expira em ${daysUntil(current!.endDate!)} ${daysUntil(current!.endDate!) === 1 ? "dia" : "dias"}`}
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              Renove para continuar com acesso e preços de associado.
            </AlertDescription>
          </Alert>
        )}

        {/* Current membership */}
        {current ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-sm">{current.plan.name}</p>
                <p className="text-xs text-muted-foreground">
                  {DURATION_LABELS[current.plan.durationMonths] ?? `${current.plan.durationMonths} meses`}
                  {" · "}
                  {moneyFormatter.format(current.plan.price)}
                </p>
              </div>
              <MembershipStatusBadge status={current.status} />
            </div>

            {current.status === "ACTIVE" && current.endDate && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BadgeCheck className="size-3.5 text-green-600" />
                {isExpiringSoon
                  ? `Válido até ${dayjs(current.endDate).format("DD/MM/YYYY")} — renove em breve`
                  : `Válido até ${dayjs(current.endDate).format("DD/MM/YYYY")}`}
              </div>
            )}

            {current.status === "ACTIVE" && current.endDate && !isExpiringSoon && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                Próxima renovação sugerida: {dayjs(current.endDate).format("DD/MM/YYYY")}
              </div>
            )}

            {current.status === "PENDING" && (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => onNavigate(`/associations/${current.id}/pix`)}
              >
                <Clock className="size-4" />
                Ver código PIX
              </Button>
            )}

            {(current.status === "EXPIRED" || isExpiringSoon) && (
              <Button
                size="sm"
                variant={isExpiringSoon ? "default" : "outline"}
                className="w-full"
                onClick={() => onNavigate(`/${group.storeSlug}`)}
              >
                <RefreshCw className="size-4" />
                Renovar associação
              </Button>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma associação ativa no momento.</p>
        )}

        {/* Payment history */}
        {confirmedPayments.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Histórico de pagamentos
              </p>
              {confirmedPayments.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        m.status === "ACTIVE"
                          ? "border-green-200 text-green-700 dark:text-green-400"
                          : "border-muted text-muted-foreground"
                      }
                    >
                      {m.status === "ACTIVE" ? "Ativo" : "Expirado"}
                    </Badge>
                    <span className="text-muted-foreground">
                      {m.startDate
                        ? `${dayjs(m.startDate).format("MM/YYYY")} → ${dayjs(m.endDate).format("MM/YYYY")}`
                        : dayjs(m.createdAt).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <span className="font-medium tabular-nums">
                    {moneyFormatter.format(m.plan.price)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function UserMembershipsPage() {
  const navigate = useNavigate();

  const { data: memberships, isLoading, isError } = useQuery<Membership[]>({
    queryKey: ["my-memberships"],
    queryFn: () => api.get("/me/memberships").then((r) => r.data),
  });

  const groups = memberships ? groupByStore(memberships) : [];

  return (
    <>
      <Header />
      <div className="w-full md:max-w-[600px] mx-auto py-8 px-4 flex flex-col gap-6">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>

        <div>
          <h1 className="text-xl font-semibold">Minhas associações</h1>
          <p className="text-sm text-muted-foreground">
            Associações que você possui em atléticas e páginas
          </p>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <Alert>
            <CircleX className="h-4 w-4" />
            <AlertTitle>Não foi possível carregar</AlertTitle>
            <AlertDescription>Tente novamente mais tarde</AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && groups.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <Users className="size-7 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Nenhuma associação</h3>
              <p className="text-sm text-muted-foreground">
                Torne-se membro de uma atlética para ver aqui.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <StoreSection
              key={group.storeId}
              group={group}
              onNavigate={navigate}
            />
          ))}
        </div>
      </div>
    </>
  );
}
