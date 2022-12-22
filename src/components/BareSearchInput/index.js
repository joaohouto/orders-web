import React from "react";

import { InputBox, InputElement } from "./styles";

const SearchInput = ({ onClick, value, ...rest }) => {
  return (
    <InputBox>
      <InputElement value={value} {...rest} />
    </InputBox>
  );
};

export default SearchInput;
