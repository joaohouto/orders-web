"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ShoppingBag,
  CircleX,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";

const orderStatuses = {
  PENDING: "PENDENTE",
  CONFIRMED: "CONFIRMADO",
  IN_PRODUCTION: "EM PRODUÇÃO",
  READY: "PRONTO",
  DELIVERED: "ENTREGUE",
  CANCELED: "CANCELADO",
};

type StatusUpdate = {
  id: string;
  createdAt: Date;
  status: keyof typeof orderStatuses;
  changedBy?: {
    name: string;
  };
};

const getStatusIcon = (status: StatusUpdate["status"]) => {
  switch (status) {
    case "PENDING":
      return <Clock />;
    case "CONFIRMED":
      return <CheckCircle2 />;
    case "IN_PRODUCTION":
      return <ShoppingBag />;
    case "READY":
      return <Package />;
    case "DELIVERED":
      return <Truck />;
    case "CANCELED":
      return <CircleX />;
  }
};

const getStatusText = (status: StatusUpdate["status"]) => {
  return orderStatuses[status];
};

export default function OrderStatusHistory({
  statusUpdates,
}: {
  statusUpdates: StatusUpdate[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Status do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusUpdates?.map((update, index) => (
            <div
              key={update.id}
              className="flex items-start gap-3 pb-4 relative"
            >
              {/* Linha conectando os itens */}
              {index < statusUpdates.length - 1 && (
                <div className="absolute left-[11px] top-[25px] w-[2px] h-[calc(100%-12px)] bg-muted"></div>
              )}

              {/* Ícone do status */}
              <div className="z-10">{getStatusIcon(update.status)}</div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <Badge variant="outline" className="font-medium">
                    {getStatusText(update.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {dayjs(update.createdAt)
                      .locale("pt-Br")
                      .format("DD [de] MMMM [de] YYYY [às] HH:mm")}
                  </span>
                </div>
                <p className="text-sm">
                  Alterado por:{" "}
                  <span className="font-medium">
                    {update.changedBy?.name || "Sistema"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
