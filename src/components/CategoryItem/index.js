import React from "react";

import { IconArrowRight } from "@tabler/icons";

import { Container } from "./styles";

const CategoryItem = ({ name, icon, ...rest }) => {
  return (
    <Container {...rest}>
      <div>
        <div>
          <span>{icon}</span>
        </div>

        <div>
          <span>Nome</span>
          <strong>{name}</strong>
        </div>
      </div>

      <IconArrowRight size={20} color="#aaa" />
    </Container>
  );
};

export default CategoryItem;
