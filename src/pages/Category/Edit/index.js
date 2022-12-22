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
import Button from "../../../components/Button";
import { Container, Content, Row } from "./styles";
import Loader from "../../../components/Loader";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [category, setCategory] = useState({});

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

      const response = await api.get(`/categories/${id}`);

      setCategory(response.data.category);
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
          icon: Yup.string().required("Informe um ícone."),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.put(`/categories/${id}`, data);

        history.push("/categorias");

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
            <h2>Editar Categoria</h2>
          </Row>

          {loading ? (
            <Loader />
          ) : (
            <Form ref={formRef} onSubmit={handleSubmit} initialData={category}>
              <Input label="Nome" type="text" name="name" />
              <Input label="Ícone (Emoji)" type="text" name="icon" />

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
