import React, { useRef, useCallback, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required("Informe uma senha."),
          passwordConfirm: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "As senhas devem corresponder."
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const token = location.search.replace("?token=", "");

        await api.post("/reset_password", {
          token,
          password: data.password,
        });

        history.push("/login");

        addToast({
          type: "success",
          title: "Feito!",
          description: "Senha alterado com sucesso.",
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
          description: "Algo deu errado.",
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
            <IconLock size={32} /> Nova senha
          </h1>

          <Input label="Senha" type="password" name="password" />
          <Input
            label="Repita a senha"
            type="password"
            name="passwordConfirm"
          />

          <p>
            Escolha uma senha com pelo menos 8 caracteres da qual você irá se
            lembrar. Utilize letras maiúsculas e minúsculas, números e símbolos.
          </p>

          <Button type="submit" isLoading={loading} style={{ marginTop: 40 }}>
            Enviar
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
