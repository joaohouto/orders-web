import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";

import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/auth";
import api from "@/services/api";

import { useQuery } from "@tanstack/react-query";
import { OrderItem } from "@/components/order-item";

export function UserOrdersPage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    data: myOrders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`orders-${user.id}`],
    queryFn: getMyOrders,
  });

  async function getMyOrders() {
    const res = await api.get(`/me/orders`);
    return res.data;
  }

  return (
    <>
      <Header />
      <div className="w-full md:max-w-[600px] mx-auto p-8 flex flex-col gap-8">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>

        {isLoading && <span>Carregando pedidos...</span>}

        {isError && <span>Erro ao carregar os seus pedidos</span>}

        {myOrders?.map((order: any) => (
          <OrderItem
            key={order.id}
            orderId={order.id}
            createdAt={order.createdAt}
            updatedAt={order.updatedAt}
            status={order.status}
            products={order.items}
            total={order.totalPrice}
          />
        ))}
      </div>
    </>
  );
}
