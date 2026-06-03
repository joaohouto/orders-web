import { useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppHeader } from "@/components/app-header";
import { LoadingPage } from "@/components/page-loading";
import { ErrorPage } from "@/components/page-error";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import api from "@/services/api";
import { moneyFormatter } from "@/lib/utils";
import { AssociationPlan } from "@/types/association";

const DURATION_OPTIONS = [
  { value: "1", label: "Mensal (1 mês)" },
  { value: "6", label: "Semestral (6 meses)" },
  { value: "12", label: "Anual (12 meses)" },
];

const planSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Preço deve ser positivo"),
  durationMonths: z.enum(["1", "6", "12"]),
});

type PlanForm = z.infer<typeof planSchema>;

export function AssociationsPage() {
  const { storeSlug } = useParams();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AssociationPlan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const queryKey = ["association-plans", storeSlug];

  const { data: plans, isLoading, isError } = useQuery<AssociationPlan[]>({
    queryKey,
    queryFn: () =>
      api
        .get(`/stores/${storeSlug}/association-plans`, { params: { all: "true" } })
        .then((r) => r.data),
  });

  const { data: store } = useQuery({
    queryKey: ["store", storeSlug],
    queryFn: () => api.get(`/stores/${storeSlug}`).then((r) => r.data),
  });

  const form = useForm<PlanForm>({
    resolver: zodResolver(planSchema),
    defaultValues: { name: "", description: "", price: 0, durationMonths: "1" },
  });

  function openCreate() {
    setEditingPlan(null);
    form.reset({ name: "", description: "", price: 0, durationMonths: "1" });
    setDialogOpen(true);
  }

  function openEdit(plan: AssociationPlan) {
    setEditingPlan(plan);
    form.reset({
      name: plan.name,
      description: plan.description ?? "",
      price: plan.price,
      durationMonths: String(plan.durationMonths) as "1" | "6" | "12",
    });
    setDialogOpen(true);
  }

  const saveMutation = useMutation({
    mutationFn: async (values: PlanForm) => {
      if (editingPlan) {
        return api.patch(`/association-plans/${editingPlan.id}`, values).then((r) => r.data);
      }
      return api.post(`/stores/${store.id}/association-plans`, values).then((r) => r.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setDialogOpen(false);
      toast.success(editingPlan ? "Plano atualizado" : "Plano criado");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error ?? "Erro ao salvar plano");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (plan: AssociationPlan) =>
      api.patch(`/association-plans/${plan.id}`, { isActive: !plan.isActive }).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: () => toast.error("Erro ao alterar status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (planId: string) =>
      api.delete(`/association-plans/${planId}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setDeletingPlanId(null);
      toast.success("Plano removido");
    },
    onError: () => toast.error("Erro ao remover plano"),
  });

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  return (
    <>
      <AppHeader routes={[{ path: "associations", title: "Associações" }]} />

      <div className="flex flex-col gap-6 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Planos de associação</h2>
            <p className="text-sm text-muted-foreground">
              Defina os planos disponíveis para membros da sua página
            </p>
          </div>
          <Button onClick={openCreate}>
            <PlusIcon className="size-4" />
            Novo plano
          </Button>
        </div>

        {plans?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum plano criado ainda. Crie o primeiro plano de associação.
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans?.map((plan) => (
            <Card key={plan.id} className={!plan.isActive ? "opacity-60" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  {!plan.isActive && (
                    <Badge variant="secondary" className="shrink-0">
                      Inativo
                    </Badge>
                  )}
                </div>
                {plan.description && (
                  <CardDescription>{plan.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <p className="text-2xl font-bold">
                    {moneyFormatter.format(plan.price)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {DURATION_OPTIONS.find((d) => d.value === String(plan.durationMonths))?.label ?? `${plan.durationMonths} meses`}
                  </p>
                  {plan.activeMembers !== undefined && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.activeMembers} {plan.activeMembers === 1 ? "membro ativo" : "membros ativos"}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Switch
                      id={`active-${plan.id}`}
                      checked={plan.isActive}
                      onCheckedChange={() => toggleMutation.mutate(plan)}
                    />
                    <Label htmlFor={`active-${plan.id}`} className="text-sm">
                      {plan.isActive ? "Ativo" : "Inativo"}
                    </Label>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(plan)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeletingPlanId(plan.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Editar plano" : "Novo plano de associação"}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do plano</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Associado 2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Benefícios, informações adicionais..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" placeholder="0,00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DURATION_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingPlanId} onOpenChange={(o) => !o && setDeletingPlanId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover plano</AlertDialogTitle>
            <AlertDialogDescription>
              O plano será desativado e não ficará mais disponível para novos membros. Membros existentes não serão afetados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingPlanId && deleteMutation.mutate(deletingPlanId)}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
