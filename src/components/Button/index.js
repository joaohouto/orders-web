import React from "react";

import { ButtonElement, Spin } from "./styles";

const Button = ({ children, isLoading, ...rest }) => {
  return (
    <ButtonElement isLoading={isLoading} {...rest}>
      {isLoading ? <Spin /> : children}
    </ButtonElement>
  );
};

export default Button;
