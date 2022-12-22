import React from "react";

import { IconSearch } from "@tabler/icons";

import { InputBox, InputElement, IconContainer } from "./styles";

const SearchInput = ({ onClick, value, ...rest }) => {
  return (
    <InputBox>
      <InputElement value={value} {...rest} />

      <IconContainer type="submit" onClick={onClick}>
        <IconSearch size={20} color="#222" />
      </IconContainer>
    </InputBox>
  );
};

export default SearchInput;
