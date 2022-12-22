import React, { useEffect, useRef, useCallback, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
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
import Loader from "../../../components/Loader";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);

  const { id } = useParams();
  const { addToast } = useToast();
  const formRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    getData();
  }, []);

  const getData = async (e) => {
    e?.preventDefault();

    try {
      setLoading(true);

      const productsResponse = await api.get(`/products/${id}`);
      setProduct(productsResponse.data.product);

      const cateogoriesResponse = await api.get("/categories");
      setCategories(cateogoriesResponse.data.categories);
    } catch (err) {
      console.log(err);

      addToast({
        type: "error",
        title: "Erro!",
        description: err.response?.data.message || "Algo deu errado!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(
    async (data) => {
      try {
        setLoadingAction(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Informe um nome."),
          category: Yup.string().required("Informe uma categoria."),
          price: Yup.string().required("Informe um preço."),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.put(`/products/${id}`, data);

        history.push("/produtos");

        addToast({
          type: "success",
          title: "Feito!",
          description: "Item alterado com sucesso.",
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
        setLoadingAction(false);
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
            <h2>Editar Produto</h2>
          </Row>

          {loading ? (
            <Loader />
          ) : (
            <Form ref={formRef} onSubmit={handleSubmit} initialData={product}>
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

              <Button type="submit" isLoading={loadingAction}>
                Salvar
              </Button>
            </Form>
          )}
        </div>
      </Content>
    </Container>
  );
};

export default Dashboard;
