import React from "react";

import formatNumber from "../../utils/formatNumber";
import { IconCirclePlus, IconInfoCircle } from "@tabler/icons";

import { Container } from "./styles";

const OrderItem = ({
  table,
  product,
  quantity,
  observations,
  status,
  ...rest
}) => {
  const validStatuses = {
    WAITING: "Aguardando",
    PREPARING: "Preparado",
    DONE: "Pronto",
  };

  return (
    <Container {...rest}>
      <img src={product?.imageUrl} alt="Imagem" />

      <div>
        <span>Mesa {table}</span>

        <strong>
          <span>x{quantity}</span> {product?.name}
        </strong>

        {!!observations && (
          <div>
            <IconInfoCircle size={14} />
            <span>{observations}</span>
          </div>
        )}
      </div>
    </Container>
  );
};

export default OrderItem;
