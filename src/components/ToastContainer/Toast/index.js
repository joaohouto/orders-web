import React, { useEffect } from "react";

import {
  IconInfoCircle,
  IconAlertCircle,
  IconCircleCheck,
  IconX,
} from "@tabler/icons";

import { Container } from "./styles";
import { useToast } from "../../../hooks/toast";

const icons = {
  info: <IconInfoCircle size={30} />,
  error: <IconAlertCircle size={30} />,
  success: <IconCircleCheck size={30} />,
};

const Toast = ({ message }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => removeToast(message.id), 5000);

    return () => clearTimeout(timer);
  }, [removeToast, message.id]);

  return (
    <Container
      id="toast"
      onClick={() => removeToast(message.id)}
      type={message.type}
    >
      <div>
        {icons[message.type || "info"]}

        <div>
          <strong>{message.title}</strong>
          <p>{message.description}</p>
        </div>
      </div>

      <IconX size={15} color="#777" />
    </Container>
  );
};

export default Toast;
