import React, { useEffect, useRef, useState } from "react";
import { useField } from "@unform/core";

import { IconAlertCircle, IconCaretDown, IconChevronDown } from "@tabler/icons";
import {
  InputBox,
  InputElement,
  InputLabel,
  WarningText,
  IconWrapper,
  Toggle,
  Dropdown,
} from "./styles";

const Input = ({ label, name, suggestions, value, onChange, ...rest }) => {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(defaultValue);
  const [query, setQuery] = useState(defaultValue.name || "");

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, [fieldName, registerField]);

  const filterItems = (item) => {
    const regex = new RegExp(query, "i");
    return item.name.match(regex);
  };

  useEffect(() => {
    if (query !== "" && !isDropdownOpen && selectedItem.name !== query) {
      setIsDropdownOpen(true);
    }
  }, [query]);

  return (
    <InputBox>
      {error && <WarningText>{error}</WarningText>}
      <InputLabel>{label}</InputLabel>
      <InputElement
        isErrored={!!error}
        name={`label-${name}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <input
        style={{ display: "none" }}
        ref={inputRef}
        defaultValue={defaultValue}
        name={name}
        value={selectedItem?._id}
        {...rest}
      />

      {!!error && (
        <IconWrapper>
          <IconAlertCircle size={20} color="#EE6666" />
        </IconWrapper>
      )}

      <Toggle type="button" onClick={() => setIsDropdownOpen((prev) => !prev)}>
        <IconChevronDown
          size={20}
          style={{
            transform: isDropdownOpen ? "rotate(-180deg)" : "rotate(0deg)",
          }}
        />
      </Toggle>

      {suggestions?.length > 0 && (
        <Dropdown isOpen={isDropdownOpen}>
          {suggestions.filter(filterItems).map((item) => (
            <button
              type="button"
              key={item._id}
              onClick={() => {
                setSelectedItem(item);
                setQuery(item.name);
                setIsDropdownOpen(false);
              }}
            >
              {item.icon} {item.name}
            </button>
          ))}

          {suggestions.filter(filterItems).length === 0 && (
            <span>Nada encontrado.</span>
          )}
        </Dropdown>
      )}
    </InputBox>
  );
};

export default Input;
