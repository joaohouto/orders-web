import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleX, Loader2 } from "lucide-react";
import { Header } from "@/components/header";

import { useNavigate } from "react-router";
import api from "@/services/api";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderItem } from "@/components/order-item";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
      <div className="w-full md:max-w-[600px] mx-auto p-8 flex flex-col gap-8">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>

        {isLoading && (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {isError && (
          <Alert>
            <CircleX className="h-4 w-4" />
            <AlertTitle>Não foi possível carregar</AlertTitle>
            <AlertDescription>Tente novamente mais tarde</AlertDescription>
          </Alert>
        )}

        {myOrders?.map((order: any) => (
          <OrderItem
            key={order.id}
            orderId={order.id}
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
