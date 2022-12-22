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
import { IconUser } from "@tabler/icons";

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
          name: Yup.string().required("Informe um nome."),
          email: Yup.string()
            .required("Informe um email.")
            .email("Informe um email válido."),
          password: Yup.string().required("Informe uma senha."),
          passwordConfirm: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "As senhas devem corresponder."
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post("/users", {
          name: data.name,
          email: data.email,
          password: data.password,
        });

        history.push("/login");

        addToast({
          type: "success",
          title: "Feito!",
          description: "Usuário cadastrado com sucesso.",
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
          description: "O cadastro de novos usuários não está aberto.",
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
            <IconUser size={32} /> Cadastro
          </h1>

          <Input label="Nome" type="text" name="name" />
          <Input label="Email" type="email" name="email" />
          <Input label="Senha" type="password" name="password" />
          <Input
            label="Repita a senha"
            type="password"
            name="passwordConfirm"
          />

          <Button type="submit" isLoading={loading}>
            Enviar
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
