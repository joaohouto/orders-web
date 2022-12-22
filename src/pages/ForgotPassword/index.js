import React, { useRef, useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Form } from "@unform/web";

import getValidationErrors from "../../utils/getValidationErrors";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { Container } from "./styles";
import { IconLock } from "@tabler/icons";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const formRef = useRef(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required("Informe um email.")
            .email("Informe um email válido."),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.post("/forgot_password", {
          email: data.email,
        });

        history.push("/login");

        addToast({
          type: "success",
          title: "Feito!",
          description: response.data.message,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        console.log(err);

        addToast({
          type: "error",
          title: "Erro!",
          description: err?.response?.data.message || "Algo deu errado.",
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history]
  );

  return (
    <Container>
      <div>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <span>Orders</span>

          <h1>
            <IconLock size={32} /> Redefinir senha
          </h1>

          <Input label="Email" type="email" name="email" />
          <p>
            Um email com instruções para a redefinição de senha será enviado
            para sua caixa de entrada.
          </p>

          <Button type="submit" isLoading={loading} style={{ marginTop: 20 }}>
            Enviar
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
