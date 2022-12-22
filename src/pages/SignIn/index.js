import React, { useRef, useCallback, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Form } from "@unform/web";

import getValidationErrors from "../../utils/getValidationErrors";

import { useAuth } from "../../hooks/auth";
import { useToast } from "../../hooks/toast";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { Container } from "./styles";

import textureImg from "../../assets/texture.svg";
import { IconLock } from "@tabler/icons";

const SignIn = () => {
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const formRef = useRef(null);

  const { signIn } = useAuth();
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
          password: Yup.string().required("Informe a senha."),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push("/");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        console.log(err);

        addToast({
          type: "error",
          title: "Erro na autenticação",
          description: err.response?.data.message || "Algo deu errado!",
        });
      } finally {
        setLoading(false);
      }
    },
    [signIn, addToast, history]
  );

  return (
    <Container>
      <div>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <span>Orders</span>

          <h1>
            <IconLock size={32} /> Autenticação
          </h1>

          <Input label="Email" type="email" name="email" />
          <Input label="Senha" type="password" name="password" />

          <Link to="/recuperar">Esqueceu a senha?</Link>

          <Button type="submit" isLoading={loading} style={{ marginTop: 40 }}>
            Entrar
          </Button>
        </Form>
      </div>

      <div>
        <img src={textureImg} alt="" />
      </div>
    </Container>
  );
};

export default SignIn;
