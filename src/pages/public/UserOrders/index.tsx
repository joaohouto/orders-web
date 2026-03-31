import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleX, ShoppingBag } from "lucide-react";
import { Header } from "@/components/header";

import { Link, useNavigate } from "react-router";
import api from "@/services/api";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderItem } from "@/components/order-item";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export function UserOrdersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const queryKey = [`myOrders`];

  const {
    data: myOrders,
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: getMyOrders,
  });

  async function getMyOrders() {
    const res = await api.get(`/me/orders`);
    return res.data;
  }

  function handleCancelOrder(orderId: string) {
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return old;
      return old.map((order: any) =>
        order.id === orderId ? { ...order, status: "CANCELED" } : order
      );
    });
  }

  return (
    <>
      <Header />
      <div className="w-full md:max-w-[600px] mx-auto py-8 px-4 flex flex-col gap-8">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>

        {isLoading && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border overflow-hidden">
                {/* Card header */}
                <div className="bg-muted px-6 pt-6 pb-4 flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-28 rounded" />
                    <Skeleton className="h-4 w-44 rounded" />
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                {/* Card content */}
                <div className="px-6 py-4 flex flex-col gap-4">
                  <Skeleton className="h-4 w-32 rounded" />

                  {Array.from({ length: 2 }).map((_, j) => (
                    <div key={j} className="grid grid-cols-[48px_auto_1fr_auto] items-center gap-2">
                      <Skeleton className="size-12 rounded-md" />
                      <Skeleton className="h-4 w-6 rounded" />
                      <Skeleton className="h-4 w-full rounded" />
                      <Skeleton className="h-4 w-14 rounded" />
                    </div>
                  ))}

                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-10 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                </div>

                {/* Card footer */}
                <div className="border-t px-6 py-4">
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </div>
            ))}
          </>
        )}

        {isError && (
          <Alert>
            <CircleX className="h-4 w-4" />
            <AlertTitle>Não foi possível carregar</AlertTitle>
            <AlertDescription>Tente novamente mais tarde</AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && myOrders?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Nenhum pedido ainda</h3>
              <p className="text-sm text-muted-foreground">
                Seus pedidos aparecerão aqui assim que você realizar uma compra.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/">Explorar lojas</Link>
            </Button>
          </div>
        )}

        {myOrders?.map((order: any) => (
          <OrderItem
            key={order.id}
            orderId={order.id}
            code={order.code}
            createdAt={order.createdAt}
            updatedAt={order.updatedAt}
            status={order.status}
            products={order.items}
            total={order.totalPrice}
            onCancelled={() => handleCancelOrder(order.id)}
          />
        ))}
      </div>
    </>
  );
}
