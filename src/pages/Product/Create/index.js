import React, { useRef, useCallback, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Form } from "@unform/web";

import getValidationErrors from "../../../utils/getValidationErrors";

import { useToast } from "../../../hooks/toast";
import api from "../../../services/api";

import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import Input from "../../../components/Input";
import Autocomplete from "../../../components/Autocomplete";
import Button from "../../../components/Button";
import { Container, Content, Row } from "./styles";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const { addToast } = useToast();
  const formRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data.categories);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Informe um nome."),
          category: Yup.string().required("Informe uma categoria."),
          price: Yup.string().required("Informe um preço."),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post("/products", data);

        history.push("/produtos");

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
            <h2>Novo Produto</h2>
          </Row>

          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input label="Nome" type="text" name="name" />
            <Input label="Descrição" type="text" name="description" />
            <Autocomplete
              label="Categoria"
              type="text"
              name="category"
              suggestions={categories}
            />

            <Input
              label="Preço (R$)"
              type="number"
              name="price"
              min="0"
              step="0.01"
              placeholder="0,00"
            />
            <Input label="Imagem (URL)" type="text" name="imageUrl" />

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
