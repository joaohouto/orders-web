import React, { useEffect, useRef } from "react";
import { useField } from "@unform/core";

import { IconAlertCircle } from "@tabler/icons";
import {
  InputBox,
  InputElement,
  InputLabel,
  WarningText,
  IconWrapper,
} from "./styles";

const Input = ({ label, name, ...rest }) => {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, [fieldName, registerField]);

  return (
    <InputBox>
      {error && <WarningText>{error}</WarningText>}
      <InputLabel>{label}</InputLabel>
      <InputElement
        ref={inputRef}
        defaultValue={defaultValue}
        isErrored={!!error}
        name={name}
        {...rest}
      />

      {!!error && (
        <IconWrapper>
          <IconAlertCircle size={20} color="#EE6666" />
        </IconWrapper>
      )}
    </InputBox>
  );
};

export default Input;
