import { useEffect, useReducer } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { UseFormReturn } from "react-hook-form";
import { moneyFormatter } from "@/lib/utils";

type TextInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  showLabel?: boolean;
  placeholder?: string;
};

export default function MoneyInput({
  showLabel = true,
  form,
  name,
  label,
  placeholder,
}: TextInputProps) {
  const [value, setValue] = useReducer((_: any, next: string) => {
    const digits = next.replace(/\D/g, "");
    return moneyFormatter.format(Number(digits) / 100);
  }, "");

  // 🔥 Atualiza o valor interno se o valor do form mudar (ex: reset)
  useEffect(() => {
    const current = form.getValues(name);
    const formatted = current ? moneyFormatter.format(current) : "";
    setValue(formatted);
  }, [form.watch(name)]); // reage quando esse campo muda

  function handleChange(realChangeFn: Function, formattedValue: string) {
    const digits = formattedValue.replace(/\D/g, "");
    const realValue = Number(digits) / 100;
    realChangeFn(realValue);
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const _change = field.onChange;

        return (
          <FormItem>
            {showLabel && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                placeholder={placeholder}
                type="text"
                onChange={(ev) => {
                  setValue(ev.target.value);
                  handleChange(_change, ev.target.value);
                }}
                value={value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
