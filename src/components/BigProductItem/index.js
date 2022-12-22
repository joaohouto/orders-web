import React from "react";

import formatNumber from "../../utils/formatNumber";
import { IconCirclePlus } from "@tabler/icons";

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
      <img src={imageUrl} alt="Imagem" />

      <div>
        <strong>{name}</strong>
        <p>{description}</p>

        <div>
          <span>R$ {formatNumber(price)}</span>

          <button>
            <IconCirclePlus size={24} />
          </button>
        </div>
      </div>
    </Container>
  );
};

export default ProductItem;
