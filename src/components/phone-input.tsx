import { useMask } from "@react-input/mask";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  name: string;
}

const maskConfig = {
  mask: "(__) _____-____",
  replacement: { _: /\d/ },
};

export function PhoneInput({ value, onChange, onBlur, name }: PhoneInputProps) {
  const inputRef = useMask(maskConfig);

  useEffect(() => {
    if (inputRef.current && value) {
      const numbersOnly = value.replace(/\D/g, "");

      const formatted =
        numbersOnly.length === 11
          ? `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(
              2,
              7
            )}-${numbersOnly.slice(7)}`
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
      placeholder="(00) 00000-0000"
    />
  );
}
