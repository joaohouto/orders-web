import React from "react";

import formatNumber from "../../utils/formatNumber";
import { IconArrowRight } from "@tabler/icons";

import { Container } from "./styles";

const ProductItem = ({
  name,
  description,
  category,
  price,
  imageUrl,
  ...rest
}) => {
  return (
    <Container {...rest}>
      <div>
        <div>
          <img src={imageUrl} alt="Imagem" />
        </div>
        <div>
          <span>Nome</span>
          <strong>{name}</strong>
        </div>
        <div>
          <span>Categoria</span>
          <strong>{category?.name}</strong>
        </div>
        <div>
          <span>Preço</span>
          <strong>R$ {formatNumber(price)}</strong>
        </div>
      </div>

      <IconArrowRight size={20} color="#aaa" />
    </Container>
  );
};

export default ProductItem;
