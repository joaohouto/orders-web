import { SiteFooter } from "@/components/footer";
import { Header } from "@/components/header";
import { ErrorPage } from "@/components/page-error";
import { ProductItem } from "@/components/products/item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  InstagramIcon,
  PackageOpen,
  RefreshCw,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { moneyFormatter } from "@/lib/utils";
import {
  AssociationPlan,
  Membership,
  MembershipStatus,
} from "@/types/association";
import { JoinAssociationDialog } from "./components/JoinAssociationDialog";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router";

const DURATION_LABELS: Record<number, string> = {
  1: "mensal",
  6: "semestral",
  12: "anual",
};

function PlanAction({
  membership,
  onJoin,
  onViewPix,
}: {
  membership: Membership | undefined;
  onJoin: () => void;
  onViewPix: (id: string) => void;
}) {
  const status = membership?.status as MembershipStatus | undefined;

  if (status === "ACTIVE") {
    return (
      <div className="flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400">
        <CheckCircle2 className="size-4 shrink-0" />
        Você é membro
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onViewPix(membership!.id)}
      >
        <Clock className="size-4" />
        Ver PIX
      </Button>
    );
  }

  if (status === "EXPIRED") {
    return (
      <Button size="sm" variant="outline" onClick={onJoin}>
        <RefreshCw className="size-4" />
        Renovar
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={onJoin}>
      Tornar-se membro
    </Button>
  );
}

export function StorePage() {
  const { storeSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [joiningPlan, setJoiningPlan] = useState<AssociationPlan | null>(null);

  const {
    data: store,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`store-${storeSlug}`],
    queryFn: getStore,
  });

  async function getStore() {
    const res = await api.get(`/stores/${storeSlug}`);
    return res.data;
  }

  const {
    data: products,
    isLoading: loadingProducts,
    isError: errorProducts,
  } = useQuery({
    queryKey: [`store-${storeSlug}-products`],
    queryFn: getStoreProducts,
  });

  async function getStoreProducts() {
    const res = await api.get(`/stores/${storeSlug}/products`);
    return res.data;
  }

  const { data: associationPlans } = useQuery<AssociationPlan[]>({
    queryKey: [`store-${storeSlug}-association-plans`],
    queryFn: () =>
      api.get(`/stores/${storeSlug}/association-plans`).then((r) => r.data),
  });

  const { data: userMemberships } = useQuery<Membership[]>({
    queryKey: ["my-memberships"],
    queryFn: () => api.get("/me/memberships").then((r) => r.data),
    enabled: !!user,
  });

  const membershipByPlan = (userMemberships ?? []).reduce<
    Record<string, Membership>
  >((acc, m) => {
    const existing = acc[m.planId];
    if (
      !existing ||
      m.status === "ACTIVE" ||
      (m.status === "PENDING" && existing.status !== "ACTIVE")
    ) {
      acc[m.planId] = m;
    }
    return acc;
  }, {});

  const hasPlans = associationPlans && associationPlans.length > 0;

  function handleJoin(plan: AssociationPlan) {
    if (!user) {
      navigate("/auth");
      return;
    }
    setJoiningPlan(plan);
  }

  useEffect(() => {
    if (store?.name) {
      document.title = store.name;
    }
    return () => {
      document.title = "vendeuu";
    };
  }, [store?.name]);

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Header />

      <div className="w-full md:w-[720px] flex flex-col py-6 px-4 gap-4 pb-20">
        <section className="mb-8 space-y-4">
          {/* Banner */}
          {isLoading ? (
            <Skeleton className="w-full h-[100px] md:h-[200px] rounded-xl" />
          ) : (
            store.banner && (
              <img
                src={store.banner}
                className="w-full h-[100px] md:h-[200px] rounded-xl border object-cover"
              />
            )
          )}

          {/* Store identity */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Skeleton className="size-[100px] rounded-xl flex-shrink-0" />
            ) : (
              <img
                src={store.icon || "/placeholder.svg"}
                className="size-[100px] rounded-xl border object-cover flex-shrink-0"
              />
            )}
            <div className="space-y-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-7 w-40 rounded-md" />
                  <Skeleton className="h-7 w-28 rounded-full" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {store.name}
                  </h1>
                  {store.instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      asChild
                    >
                      <a
                        href={`https://instagram.com/${store.instagram}`}
                        target="_blank"
                      >
                        <InstagramIcon />
                        {store.instagram}
                      </a>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {hasPlans && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm uppercase font-medium text-muted-foreground">
                Associações
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 mb-6">
              {associationPlans.map((plan) => (
                <Card key={plan.id} className="border-2">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {DURATION_LABELS[plan.durationMonths] ??
                          `${plan.durationMonths} meses`}
                      </Badge>
                    </div>
                    {plan.description && (
                      <CardDescription>{plan.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-4">
                    <p className="text-xl font-bold">
                      {moneyFormatter.format(plan.price)}
                    </p>
                    <PlanAction
                      membership={membershipByPlan[plan.id]}
                      onJoin={() => handleJoin(plan)}
                      onViewPix={(id) => navigate(`/associations/${id}/pix`)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm uppercase font-medium mb-4 text-muted-foreground">
            Produtos
          </h2>

          {loadingProducts ? (
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full h-32 rounded-md" />
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/3 rounded" />
                </div>
              ))}
            </div>
          ) : products?.data?.length > 0 ? (
            <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {products.data.map((product: any) => (
                <ProductItem key={product.id} item={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <PackageOpen className="size-10 stroke-1" />
              <p className="text-sm font-medium">Nenhum produto disponível</p>
            </div>
          )}
        </div>
      </div>

      <SiteFooter />

      <JoinAssociationDialog
        plan={joiningPlan}
        storeSlug={storeSlug!}
        open={!!joiningPlan}
        onOpenChange={(open) => !open && setJoiningPlan(null)}
      />
    </div>
  );
}
