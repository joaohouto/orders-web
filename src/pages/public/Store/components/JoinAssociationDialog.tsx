import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { PhoneInput } from "@/components/phone-input";
import { CPFInput } from "@/components/cpf-input";
import { Separator } from "@/components/ui/separator";

import api from "@/services/api";
import { moneyFormatter, isValidCPF, formatCPF } from "@/lib/utils";
import { AssociationPlan } from "@/types/association";
import { useAuth } from "@/hooks/auth";

const DURATION_LABELS: Record<number, string> = {
  1: "mensal",
  6: "semestral",
  12: "anual",
};

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  phone: z
    .string()
    .min(14, "Número incompleto")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
  document: z.string().refine(isValidCPF, { message: "CPF inválido" }),
});

type JoinForm = z.infer<typeof formSchema>;

interface JoinAssociationDialogProps {
  plan: AssociationPlan | null;
  storeSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinAssociationDialog({
  plan,
  storeSlug,
  open,
  onOpenChange,
}: JoinAssociationDialogProps) {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<JoinForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      document: user?.document ? formatCPF(user.document) : "",
    },
  });

  async function onSubmit(values: JoinForm) {
    if (!plan) return;
    setSubmitting(true);

    try {
      await api.patch("/users/profile", {
        name: values.name,
        email: values.email,
        phone: values.phone,
        document: values.document.replace(/\D/g, ""),
      });

      if (user) {
        updateUser({
          ...user,
          name: values.name,
          email: values.email,
          phone: values.phone,
          document: values.document.replace(/\D/g, ""),
        });
      }

      const { data: membership } = await api.post(`/stores/${storeSlug}/memberships`, {
        planId: plan.id,
      });

      onOpenChange(false);
      navigate(`/associations/${membership.id}/pix`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Erro ao criar associação");
    } finally {
      setSubmitting(false);
    }
  }

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tornar-se membro</DialogTitle>
          <DialogDescription>
            {plan.name} — {moneyFormatter.format(plan.price)}{" "}
            ({DURATION_LABELS[plan.durationMonths] ?? `${plan.durationMonths} meses`})
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <p className="text-sm text-muted-foreground">
          Confirme seus dados para continuar. Após o cadastro, você receberá um PIX para efetuar o pagamento.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <CPFInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Aguarde...
                  </>
                ) : (
                  "Continuar para pagamento"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
