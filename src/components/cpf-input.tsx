import { useMask } from "@react-input/mask";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface CPFInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  name: string;
}

const cpfMaskConfig = {
  mask: "___.___.___-__",
  replacement: { _: /\d/ },
};

export function CPFInput({ value, onChange, onBlur, name }: CPFInputProps) {
  const inputRef = useMask(cpfMaskConfig);

  useEffect(() => {
    if (inputRef.current && value) {
      const numbersOnly = value.replace(/\D/g, "");

      const formatted =
        numbersOnly.length === 11
          ? `${numbersOnly.slice(0, 3)}.${numbersOnly.slice(
              3,
              6
            )}.${numbersOnly.slice(6, 9)}-${numbersOnly.slice(9)}`
          : value;

      if (inputRef.current.value !== formatted) {
        inputRef.current.value = formatted;
      }
    }
  }, [value]);

  return (
    <Input
      ref={(el) => {
        if (el) inputRef.current = el;
      }}
      name={name}
      defaultValue={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder="000.000.000-00"
    />
  );
}
