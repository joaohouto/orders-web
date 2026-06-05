import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Clock,
  LucideInstagram,
  RefreshCw,
  Users,
} from "lucide-react";
import dayjs from "dayjs";
import QRCode from "react-qr-code";
import ReactMarkdown from "react-markdown";
import { motion } from "motion/react";

import { Header } from "@/components/header";
import { SiteFooter } from "@/components/footer";
import { MembershipStatusBadge } from "@/components/membership-status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ErrorPage } from "@/components/page-error";
import { JoinAssociationDialog } from "@/pages/public/Store/components/JoinAssociationDialog";

import api from "@/services/api";
import { moneyFormatter } from "@/lib/utils";
import { AssociationPlan, Membership } from "@/types/association";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";

const DURATION_LABELS: Record<number, string> = {
  1: "mensal",
  6: "semestral",
  12: "anual",
};

const EXPIRING_SOON_DAYS = 7;

function daysUntil(date: string) {
  return dayjs(date).diff(dayjs(), "day");
}

function MemberCard({
  memberName,
  memberAvatar,
  planName,
  planDurationMonths,
  storeName,
  storeIcon,
  accentColor,
  membershipId,
  startDate,
  endDate,
  isExpired,
  isPending,
}: {
  memberName: string;
  memberAvatar?: string;
  planName: string;
  planDurationMonths: number;
  storeName: string;
  storeIcon?: string;
  accentColor?: string | null;
  membershipId: string;
  startDate?: string;
  endDate?: string;
  isExpired?: boolean;
  isPending?: boolean;
}) {
  const [flipped, setFlipped] = useState(false);

  const accent = accentColor ?? "#991b1b";

  const initials = memberName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const sharedHeader = (
    <div
      className="flex items-center gap-2.5 px-5 py-3.5"
      style={{ backgroundColor: accent }}
    >
      {storeIcon ? (
        <img
          src={storeIcon}
          alt={storeName}
          className="size-7 rounded-md object-cover shrink-0 opacity-90"
        />
      ) : (
        <div className="size-7 rounded-md bg-white/15 flex items-center justify-center shrink-0">
          <Users className="size-3.5 text-white/70" />
        </div>
      )}
      <span className="text-sm font-semibold text-white/90 leading-none">
        {storeName}
      </span>
      <div className="ml-auto flex items-center gap-1 bg-white/15 rounded-full px-2 py-0.5">
        <div className={`size-1.5 rounded-full ${isExpired ? "bg-white/40" : isPending ? "bg-amber-300/80" : "bg-white/80"}`} />
        <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">
          {isExpired ? "Expirado" : isPending ? "Pendente" : "Sócio"}
        </span>
      </div>
    </div>
  );

  const glassBorder = `linear-gradient(135deg, ${accent}55 0%, ${accent}18 35%, transparent 55%, ${accent}30 100%)`;

  return (
    <div
      className={`w-full cursor-pointer${isExpired || isPending ? " opacity-80" : ""}`}
      style={{ perspective: "1200px" }}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d", position: "relative" }}
      >
        {/* ── FRONT ── */}
        <div
          className="p-px rounded-2xl"
          style={{ background: glassBorder, backfaceVisibility: "hidden" }}
        >
          <div className="rounded-[15px] overflow-hidden bg-card">
            {sharedHeader}

            <div className="flex items-center gap-4 px-5 py-5">
              <Avatar className="size-16 rounded-xl shrink-0">
                <AvatarImage src={memberAvatar} alt={memberName} />
                <AvatarFallback
                  className="rounded-xl text-lg font-bold"
                  style={{ backgroundColor: `${accent}18`, color: accent }}
                >
                  {initials || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="font-bold text-base leading-tight truncate">
                  {memberName || "—"}
                </p>
                <p className="text-sm text-muted-foreground">{planName}</p>
                <Badge
                  variant="secondary"
                  className="text-[10px] h-5 px-2 w-fit mt-1"
                >
                  {DURATION_LABELS[planDurationMonths] ??
                    `${planDurationMonths} meses`}
                </Badge>
              </div>
            </div>

            <div className="h-px mx-5 bg-border" />

            {/* Membership info */}
            <div className="px-5 py-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2
                  className="size-4 shrink-0"
                  style={{ color: accent }}
                />
                <span className="font-medium">Você é membro</span>
              </div>
              {endDate && (
                <p className="text-sm text-muted-foreground pl-6">
                  Válido até {dayjs(endDate).format("DD/MM/YYYY")}
                </p>
              )}
            </div>

            <div className="h-px mx-5 bg-border" />
            <p className="text-center text-[10px] text-muted-foreground/40 py-2.5 tracking-wide">
              toque para ver QR code
            </p>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="p-px rounded-2xl absolute inset-0"
          style={{
            background: glassBorder,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="rounded-[15px] overflow-hidden bg-card h-full">
            {sharedHeader}

            <div className="flex flex-col items-center px-5 py-6 gap-3">
              {/* QR glass frame */}
              <div
                className="p-4 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${accent}12 0%, ${accent}06 100%)`,
                  border: `1px solid ${accent}20`,
                  boxShadow: `0 4px 24px ${accent}10`,
                }}
              >
                <QRCode
                  value={membershipId}
                  size={140}
                  bgColor="transparent"
                  fgColor={accent}
                  level="M"
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-mono tracking-widest">
                {membershipId.slice(0, 8).toUpperCase()}···
                {membershipId.slice(-4).toUpperCase()}
              </p>
            </div>

            <div className="h-px mx-5 bg-border" />

            <div className="flex items-center justify-around px-8 py-4">
              {startDate && (
                <div className="text-center">
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-1">
                    Desde
                  </p>
                  <p className="text-sm font-mono font-semibold">
                    {dayjs(startDate).format("MM/YYYY")}
                  </p>
                </div>
              )}
              {startDate && endDate && <div className="h-8 w-px bg-border" />}
              {endDate && (
                <div className="text-center">
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-1">
                    Válido até
                  </p>
                  <p className="text-sm font-mono font-semibold">
                    {dayjs(endDate).format("MM/YYYY")}
                  </p>
                </div>
              )}
            </div>

            <div className="h-px mx-5 bg-border" />
            <p className="text-center text-[10px] text-muted-foreground/40 py-2.5 tracking-wide">
              toque para voltar
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function AssociationDetailPage() {
  const { planId } = useParams<{ planId: string }>();
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
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const currentMembership =
    planMemberships.find((m) => m.status === "ACTIVE" || m.status === "PENDING") ??
    planMemberships.find((m) => m.status === "EXPIRED");

  const isExpiringSoon =
    currentMembership?.status === "ACTIVE" &&
    currentMembership.endDate &&
    daysUntil(currentMembership.endDate) <= EXPIRING_SOON_DAYS &&
    daysUntil(currentMembership.endDate) >= 0;

  const isActiveMember = currentMembership?.status === "ACTIVE";
  const isExpiredMember = currentMembership?.status === "EXPIRED";
  const isPendingMember = currentMembership?.status === "PENDING";

  const [renewing, setRenewing] = useState(false);

  function handleJoin() {
    if (!user) { navigate("/auth"); return; }
    setJoinDialogOpen(true);
  }

  async function handleRenewDirect() {
    if (!user) { navigate("/auth"); return; }
    if (!plan?.store?.slug) return;
    setRenewing(true);
    try {
      const { data: newMembership } = await api.post(
        `/stores/${plan.store.slug}/memberships`,
        { planId },
      );
      queryClient.invalidateQueries({ queryKey: ["my-memberships"] });
      navigate(`/associations/${newMembership.id}/pix`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Erro ao renovar associação");
    } finally {
      setRenewing(false);
    }
  }

  function handleJoinSuccess() {
    queryClient.invalidateQueries({ queryKey: ["my-memberships"] });
  }

  if (isError) return <ErrorPage />;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 w-full md:w-[600px] mx-auto px-4 pt-6 pb-20 flex flex-col gap-6">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>

        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Store header — always visible */}
            <div className="flex items-center gap-3">
              {plan!.store?.icon ? (
                <img
                  src={plan!.store.icon}
                  alt={plan!.store.name}
                  className="size-12 rounded-xl border object-cover shrink-0"
                />
              ) : (
                <div className="size-12 rounded-xl border bg-muted flex items-center justify-center shrink-0">
                  <Users className="size-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col gap-1 min-w-0">
                <Link
                  to={`/${plan!.store?.slug}`}
                  className="font-semibold leading-tight hover:underline"
                >
                  {plan!.store?.name}
                </Link>
                {plan!.store?.instagram && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-6 text-xs w-fit px-2.5"
                    asChild
                  >
                    <a
                      href={`https://instagram.com/${plan!.store.instagram}`}
                      target="_blank"
                    >
                      <LucideInstagram className="size-3" />
                      {plan!.store.instagram}
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Plan info — always visible */}
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl font-bold tracking-tight leading-tight">
                  {plan!.name}
                </h1>
                <Badge variant="secondary" className="shrink-0 mt-0.5">
                  {DURATION_LABELS[plan!.durationMonths] ??
                    `${plan!.durationMonths} meses`}
                </Badge>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold">
                  {moneyFormatter.format(plan!.price)}
                </span>
                <span className="text-muted-foreground text-sm">
                  /{" "}
                  {DURATION_LABELS[plan!.durationMonths] ??
                    `${plan!.durationMonths} meses`}
                </span>
              </div>
            </div>

            {/* Description — markdown */}
            {plan!.description && (
              <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <ReactMarkdown>{plan!.description}</ReactMarkdown>
              </div>
            )}

            {/* "Você é membro" + renovação — após descrição */}
            <MembershipAction
              membership={currentMembership}
              isExpiringSoon={!!isExpiringSoon}
              onJoin={handleJoin}
              onRenewDirect={handleRenewDirect}
              onViewPix={(id) => navigate(`/associations/${id}/pix`)}
              price={plan!.price}
              endDate={currentMembership?.endDate}
              renewing={renewing}
            />

            <Separator />

            {/* Member card — active, pending or expired */}
            {(isActiveMember || isExpiredMember || isPendingMember) && (
              <MemberCard
                memberName={user?.name ?? ""}
                memberAvatar={user?.avatar}
                planName={plan!.name}
                planDurationMonths={plan!.durationMonths}
                storeName={plan!.store?.name ?? ""}
                storeIcon={plan!.store?.icon}
                accentColor={plan!.store?.accentColor}
                membershipId={currentMembership!.id}
                startDate={currentMembership!.startDate}
                endDate={currentMembership!.endDate}
                isExpired={isExpiredMember}
                isPending={isPendingMember}
              />
            )}

            {/* History — accordion */}
            {planMemberships.length > 0 && (
              <div className="rounded-lg border overflow-hidden">
                <Accordion type="single" collapsible>
                  <AccordionItem value="history" className="border-none px-4">
                    <AccordionTrigger className="text-sm font-semibold text-muted-foreground uppercase tracking-wide hover:no-underline py-3">
                      Histórico neste plano
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col divide-y">
                        {planMemberships.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between gap-4 py-3"
                          >
                            <div className="flex flex-col gap-0.5">
                              <MembershipStatusBadge status={m.status} />
                              <span className="text-xs text-muted-foreground mt-1">
                                {m.startDate && m.endDate
                                  ? `${dayjs(m.startDate).format("DD/MM/YYYY")} → ${dayjs(m.endDate).format("DD/MM/YYYY")}`
                                  : `Criado em ${dayjs(m.createdAt).format("DD/MM/YYYY")}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="font-medium tabular-nums text-sm">
                                {moneyFormatter.format(m.plan.price)}
                              </span>
                              {m.status === "PENDING" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    navigate(`/associations/${m.id}/pix`)
                                  }
                                >
                                  <Clock className="size-4" />
                                  Ver PIX
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </>
        )}
      </div>

      <SiteFooter />

      {plan && plan.store && (
        <JoinAssociationDialog
          plan={plan}
          storeSlug={plan.store.slug}
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
  onRenewDirect,
  onViewPix,
  price,
  endDate,
  renewing,
}: {
  membership: Membership | undefined;
  isExpiringSoon: boolean;
  onJoin: () => void;
  onRenewDirect: () => void;
  onViewPix: (id: string) => void;
  price: number;
  endDate?: string;
  renewing?: boolean;
}) {
  if (membership?.status === "ACTIVE") {
    if (!isExpiringSoon) return null;
    return (
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
        <BadgeCheck className="size-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-800 dark:text-amber-300">
          {endDate && daysUntil(endDate) === 0
            ? "Sua associação expira hoje!"
            : `Expira em ${endDate ? daysUntil(endDate) : "?"} dias`}
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-400 flex items-center justify-between gap-2">
          <span>Renove para manter o acesso.</span>
          <Button
            size="sm"
            variant="outline"
            onClick={onRenewDirect}
            disabled={renewing}
            className="shrink-0 border-amber-300 text-amber-800 hover:bg-amber-100"
          >
            <RefreshCw className="size-3" />
            {renewing ? "Aguarde..." : "Renovar"}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (membership?.status === "PENDING") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Aguardando confirmação do pagamento.
        </p>
        <Button variant="outline" onClick={() => onViewPix(membership.id)}>
          <Clock className="size-4" />
          Ver código PIX
        </Button>
      </div>
    );
  }

  if (membership?.status === "EXPIRED") {
    return (
      <Button size="lg" className="w-full" onClick={onRenewDirect} disabled={renewing}>
        <RefreshCw className="size-4" />
        {renewing ? "Aguarde..." : `Renovar — ${moneyFormatter.format(price)}`}
      </Button>
    );
  }

  return (
    <Button size="lg" className="w-full" onClick={onJoin}>
      Tornar-se membro
    </Button>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-xl shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-px w-full" />
      <Skeleton className="w-full h-72 rounded-2xl" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}
