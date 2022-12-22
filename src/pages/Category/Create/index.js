import React, { useRef, useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Form } from "@unform/web";

import getValidationErrors from "../../../utils/getValidationErrors";

import { useToast } from "../../../hooks/toast";
import api from "../../../services/api";

import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import SearchInput from "../../../components/SearchInput";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { Container, Content, Row } from "./styles";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();
  const formRef = useRef(null);
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Informe um nome."),
          icon: Yup.string().required("Informe um ícone."),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post("/categories", data);

        history.push("/categorias");

        addToast({
          type: "success",
          title: "Feito!",
          description: "Item criado com sucesso.",
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
          description: err.response?.data.message || "Algo deu errado.",
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history]
  );

  return (
    <Container>
      <Header />

      <Content>
        <Navbar />

        <div>
          <Row>
            <h2>Nova Categoria</h2>
          </Row>

          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input label="Nome" type="text" name="name" />
            <Input label="Ícone (Emoji)" type="text" name="icon" />

            <Button type="submit" isLoading={loading}>
              Salvar
            </Button>
          </Form>
        </div>
      </Content>
    </Container>
  );
};

export default Dashboard;
