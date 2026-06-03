import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Clock,
  InstagramIcon,
  RefreshCw,
  Users,
} from "lucide-react";
import dayjs from "dayjs";

import { Header } from "@/components/header";
import { SiteFooter } from "@/components/footer";
import { MembershipStatusBadge } from "@/components/membership-status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ErrorPage } from "@/components/page-error";
import { JoinAssociationDialog } from "@/pages/public/Store/components/JoinAssociationDialog";

import api from "@/services/api";
import { moneyFormatter } from "@/lib/utils";
import { AssociationPlan, Membership } from "@/types/association";
import { useAuth } from "@/hooks/auth";

const DURATION_LABELS: Record<number, string> = {
  1: "mensal",
  6: "semestral",
  12: "anual",
};

const EXPIRING_SOON_DAYS = 7;

function daysUntil(date: string) {
  return dayjs(date).diff(dayjs(), "day");
}

export function AssociationDetailPage() {
  const { storeSlug, planId } = useParams<{ storeSlug: string; planId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [joinDialogOpen, setJoinDialogOpen] = useState(false);

  const {
    data: plan,
    isLoading,
    isError,
  } = useQuery<AssociationPlan>({
    queryKey: ["association-plan", planId],
    queryFn: () => api.get(`/association-plans/${planId}`).then((r) => r.data),
  });

  const { data: userMemberships } = useQuery<Membership[]>({
    queryKey: ["my-memberships"],
    queryFn: () => api.get("/me/memberships").then((r) => r.data),
    enabled: !!user,
  });

  const planMemberships = (userMemberships ?? [])
    .filter((m) => m.planId === planId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const currentMembership = planMemberships.find(
    (m) => m.status === "ACTIVE" || m.status === "PENDING",
  );

  const historyMemberships = planMemberships.filter((m) => m !== currentMembership);

  const isExpiringSoon =
    currentMembership?.status === "ACTIVE" &&
    currentMembership.endDate &&
    daysUntil(currentMembership.endDate) <= EXPIRING_SOON_DAYS &&
    daysUntil(currentMembership.endDate) >= 0;

  function handleJoin() {
    if (!user) {
      navigate("/auth");
      return;
    }
    setJoinDialogOpen(true);
  }

  function handleJoinSuccess() {
    queryClient.invalidateQueries({ queryKey: ["my-memberships"] });
  }

  if (isError) return <ErrorPage />;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 w-full md:w-[720px] mx-auto px-4 py-8 flex flex-col gap-6 pb-20">
        <Button variant="outline" size="sm" className="w-fit" onClick={() => navigate(`/${storeSlug}`)}>
          <ArrowLeft className="size-4" />
          Voltar para a loja
        </Button>

        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Store header */}
            <div className="flex items-center gap-4">
              {plan!.store?.icon ? (
                <img
                  src={plan!.store.icon}
                  alt={plan!.store.name}
                  className="size-14 rounded-xl border object-cover shrink-0"
                />
              ) : (
                <div className="size-14 rounded-xl border bg-muted flex items-center justify-center shrink-0">
                  <Users className="size-6 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-1">
                <Link
                  to={`/${storeSlug}`}
                  className="font-semibold hover:underline"
                >
                  {plan!.store?.name}
                </Link>
                {plan!.store?.instagram && (
                  <Button variant="outline" size="sm" className="rounded-full h-7 text-xs" asChild>
                    <a href={`https://instagram.com/${plan!.store.instagram}`} target="_blank">
                      <InstagramIcon className="size-3" />
                      {plan!.store.instagram}
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Plan info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">{plan!.name}</h1>
                <Badge variant="secondary" className="shrink-0 mt-1">
                  {DURATION_LABELS[plan!.durationMonths] ?? `${plan!.durationMonths} meses`}
                </Badge>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{moneyFormatter.format(plan!.price)}</span>
                <span className="text-muted-foreground text-sm">
                  / {DURATION_LABELS[plan!.durationMonths] ?? `${plan!.durationMonths} meses`}
                </span>
              </div>

              {plan!.description && (
                <p className="text-muted-foreground leading-relaxed">{plan!.description}</p>
              )}

              {plan!.activeMembers !== undefined && plan!.activeMembers > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="size-4" />
                  {plan!.activeMembers} {plan!.activeMembers === 1 ? "membro ativo" : "membros ativos"}
                </div>
              )}
            </div>

            <Separator />

            {/* Action area */}
            <div className="flex flex-col gap-3">
              {isExpiringSoon && (
                <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                  <BadgeCheck className="size-4 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-800 dark:text-amber-300">
                    {daysUntil(currentMembership!.endDate!) === 0
                      ? "Sua associação expira hoje!"
                      : `Expira em ${daysUntil(currentMembership!.endDate!)} ${daysUntil(currentMembership!.endDate!) === 1 ? "dia" : "dias"}`}
                  </AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-400">
                    Renove agora para garantir continuidade do acesso e dos preços de associado.
                  </AlertDescription>
                </Alert>
              )}

              <MembershipAction
                membership={currentMembership}
                isExpiringSoon={!!isExpiringSoon}
                onJoin={handleJoin}
                onViewPix={(id) => navigate(`/associations/${id}/pix`)}
                price={plan!.price}
              />

              {currentMembership?.status === "ACTIVE" && currentMembership.endDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  Renovação sugerida em {dayjs(currentMembership.endDate).format("DD/MM/YYYY")}
                </div>
              )}
            </div>

            {/* User membership history */}
            {planMemberships.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-col gap-3">
                  <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    Seu histórico neste plano
                  </h2>

                  {planMemberships.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-4 py-2"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <MembershipStatusBadge status={m.status} />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {m.startDate && m.endDate
                            ? `${dayjs(m.startDate).format("DD/MM/YYYY")} → ${dayjs(m.endDate).format("DD/MM/YYYY")}`
                            : `Criado em ${dayjs(m.createdAt).format("DD/MM/YYYY")}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-medium tabular-nums">
                          {moneyFormatter.format(m.plan.price)}
                        </span>
                        {m.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/associations/${m.id}/pix`)}
                          >
                            <Clock className="size-4" />
                            Ver PIX
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between text-sm font-medium pt-1 border-t">
                    <span>Total pago</span>
                    <span className="tabular-nums">
                      {moneyFormatter.format(
                        planMemberships
                          .filter((m) => m.status === "ACTIVE" || m.status === "EXPIRED")
                          .reduce((sum, m) => sum + m.plan.price, 0),
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <SiteFooter />

      {plan && (
        <JoinAssociationDialog
          plan={plan}
          storeSlug={storeSlug!}
          open={joinDialogOpen}
          onOpenChange={(open) => {
            setJoinDialogOpen(open);
            if (!open) handleJoinSuccess();
          }}
        />
      )}
    </div>
  );
}

function MembershipAction({
  membership,
  isExpiringSoon,
  onJoin,
  onViewPix,
  price,
}: {
  membership: Membership | undefined;
  isExpiringSoon: boolean;
  onJoin: () => void;
  onViewPix: (id: string) => void;
  price: number;
}) {
  if (membership?.status === "ACTIVE") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle2 className="size-5 text-green-600 dark:text-green-400 shrink-0" />
          <div>
            <p className="font-medium text-green-800 dark:text-green-300 text-sm">
              Você é membro
            </p>
            {membership.endDate && (
              <p className="text-xs text-green-700 dark:text-green-400">
                Válido até {dayjs(membership.endDate).format("DD/MM/YYYY")}
              </p>
            )}
          </div>
        </div>
        {isExpiringSoon && (
          <Button onClick={onJoin}>
            <RefreshCw className="size-4" />
            Renovar antecipadamente
          </Button>
        )}
      </div>
    );
  }

  if (membership?.status === "PENDING") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Sua associação está aguardando confirmação do pagamento.
        </p>
        <Button variant="outline" onClick={() => onViewPix(membership.id)}>
          <Clock className="size-4" />
          Ver código PIX para pagamento
        </Button>
      </div>
    );
  }

  const isRenew = membership?.status === "EXPIRED";

  return (
    <Button size="lg" className="w-full" onClick={onJoin}>
      {isRenew ? (
        <>
          <RefreshCw className="size-4" />
          Renovar associação — {moneyFormatter.format(price)}
        </>
      ) : (
        "Tornar-se membro"
      )}
    </Button>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-3">
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-px w-full" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}
