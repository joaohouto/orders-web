import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

function StoreSection({
  group,
  onNavigate,
}: {
  group: StoreGroup;
  onNavigate: (path: string) => void;
}) {
  const sorted = [...group.memberships].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const current =
    sorted.find((m) => m.status === "ACTIVE" || m.status === "PENDING") ??
    sorted.find((m) => m.status === "EXPIRED");
  const planId = current?.planId ?? sorted[0]?.planId;

  const isExpiringSoon =
    current?.status === "ACTIVE" &&
    current.endDate &&
    daysUntil(current.endDate) <= EXPIRING_SOON_DAYS &&
    daysUntil(current.endDate) >= 0;

  return (
    <Card className="py-0 overflow-hidden gap-0">
      {/* Header — muted bg igual aos pedidos */}
      <CardHeader className="rounded-t-xl bg-muted pt-5 pb-4 grid grid-cols-[auto_1fr_auto] gap-3 items-center">
        {group.storeIcon ? (
          <img
            src={group.storeIcon}
            alt={group.storeName}
            className="size-9 rounded-lg border object-cover shrink-0"
          />
        ) : (
          <div className="size-9 rounded-lg border bg-background flex items-center justify-center shrink-0">
            <Users className="size-4 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0">
          <CardTitle className="text-sm leading-tight">
            {group.storeName}
          </CardTitle>
          {current && (
            <CardDescription className="text-xs mt-0.5">
              {current.plan.name}
              {" · "}
              {DURATION_LABELS[current.plan.durationMonths] ??
                `${current.plan.durationMonths}m`}
            </CardDescription>
          )}
        </div>
        {current && <MembershipStatusBadge status={current.status} />}
      </CardHeader>

      {/* Footer — igual ao card de pedidos */}
      <CardFooter className="border-t rounded-b-xl pt-4 pb-4 flex flex-col gap-2">
        {current?.status === "PENDING" && (
          <Button
            className="w-full"
            onClick={() => onNavigate(`/associations/${current.id}/pix`)}
          >
            <Clock className="size-4" />
            Ver código PIX
          </Button>
        )}

        {(current?.status === "EXPIRED" || isExpiringSoon) && (
          <Button
            variant={isExpiringSoon ? "default" : "outline"}
            className="w-full"
            onClick={() => onNavigate(`/memberships/plan/${planId}`)}
          >
            <RefreshCw className="size-4" />
            Renovar associação
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => onNavigate(`/memberships/plan/${planId}`)}
        >
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}

export function UserMembershipsPage() {
  const navigate = useNavigate();

  const {
    data: memberships,
    isLoading,
    isError,
  } = useQuery<Membership[]>({
    queryKey: ["my-memberships"],
    queryFn: () => api.get("/me/memberships").then((r) => r.data),
  });

  const groups = memberships ? groupByStore(memberships) : [];

  return (
    <>
      <Header />
      <div className="w-full md:max-w-[600px] mx-auto pt-6 pb-20 px-4 flex flex-col gap-6">
        {/* Header row */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-xl font-semibold leading-tight">
              Minhas associações
            </h1>
            <p className="text-sm text-muted-foreground">
              Atléticas e páginas que você é membro
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border p-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-8 w-full rounded-md" />
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

        <div className="flex flex-col gap-3">
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
