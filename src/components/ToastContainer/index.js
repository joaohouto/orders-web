import React from "react";

import Toast from "./Toast";

import { Container } from "./styles";

const ToastContainer = ({ messages }) => {
  return (
    <Container>
      {messages.map((msg, index) => (
        <Toast key={index} style={{}} message={msg} />
      ))}
    </Container>
  );
};

export default ToastContainer;
