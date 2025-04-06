import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, SaveIcon } from "lucide-react";
import { PhoneInput } from "@/components/phone-input";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router";

const formSchema = z.object({
  name: z.string({
    message: "Forneça este campo",
  }),

  email: z
    .string()
    .min(1, { message: "Forneça este campo" })
    .email("Este email não é válido"),

  phone: z
    .string()
    .min(1, "O telefone é obrigatório")
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length === 10 || digits.length === 11;
      },
      {
        message: "O telefone deve ter 10 dígitos ou 11 dígitos",
      }
    ),
});

export function OrderPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="w-full md:max-w-[600px] mx-auto p-8 flex flex-col gap-8">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
      </div>
    </>
  );
}
