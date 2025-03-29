import { Input } from "@/components/ui/input";
import { Controller, type Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function applyPhoneMask(value: string) {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");

  // Apply the mask based on the number of digits
  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : "";
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 10) {
    // Landline format: (XX) XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(
      6,
      10
    )}`;
  } else {
    // Mobile format: (XX) XXXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(
      7,
      11
    )}`;
  }
}

interface BrazilianPhoneInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PhoneInput({
  name,
  control,
  label = "Telefone",
  placeholder = "(67) 9 9999-9999",
  disabled = false,
  className,
}: BrazilianPhoneInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Controller
              name={name}
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <Input
                  type="tel"
                  placeholder={placeholder}
                  value={value || ""}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const digits = rawValue.replace(/\D/g, "");

                    // Limit to 11 digits (Brazilian mobile number length)
                    if (digits.length <= 11) {
                      const maskedValue = applyPhoneMask(rawValue);
                      onChange(maskedValue);
                    }
                  }}
                  disabled={disabled}
                  {...fieldProps}
                />
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
