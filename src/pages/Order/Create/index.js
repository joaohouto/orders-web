import React, { useRef, useCallback, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Form } from "@unform/web";

import getValidationErrors from "../../../utils/getValidationErrors";

import { useToast } from "../../../hooks/toast";
import api from "../../../services/api";

import Header from "../../../components/Header";
import ProductItem from "../../../components/BigProductItem";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Loader from "../../../components/Loader";
import { Container, Content, Row, CategoryRow, CategoryItem } from "./styles";

const Dashboard = () => {
  const [loadingAction, setLoadingAction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({});

  const { addToast } = useToast();
  const formRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (!!currentCategory) {
      getProducts();
    }
  }, [currentCategory]);

  const getProducts = async (e) => {
    e?.preventDefault();

    try {
      setLoading(true);

      const productsResponse = await api.get(`/products`, {
        params: {
          category: currentCategory._id,
        },
      });
      setProducts(productsResponse.data.products);
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

  const getCategories = async (e) => {
    e?.preventDefault();

    try {
      setLoading(true);

      const categoriesResponse = await api.get("/categories");
      setCategories(categoriesResponse.data.categories);
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
          table: Yup.string().required("Informe uma mesa."),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post("/orders", data);

        history.go(0);

        addToast({
          type: "success",
          title: "Feito!",
          description: "Pedido enviado.",
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
        <Row>
          <h2>Novo Pedido</h2>
        </Row>

        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input label="Mesa" type="text" name="table" />

          <CategoryRow>
            {categories?.map((item) => (
              <CategoryItem
                key={item._id}
                isActive={item._id === currentCategory._id}
                onClick={() => setCurrentCategory(item)}
                type="button"
              >
                <b>{item.icon}</b>
                <span>{item.name}</span>
              </CategoryItem>
            ))}
          </CategoryRow>

          {loading ? (
            <Loader />
          ) : products?.length > 0 ? (
            products?.map((item) => (
              <ProductItem
                key={item._id}
                name={item.name}
                description={item.description}
                category={item.category}
                price={item.price}
                imageUrl={item.imageUrl}
                onClick={() => history.push(`/produtos/v/${item._id}`)}
              />
            ))
          ) : (
            <span>Nada foi encontrado.</span>
          )}

          <Input label="Produto" type="text" name="product" />
          <Input label="Quantidade" type="number" name="quantity" />
          <Input label="Observações" type="text" name="observations" />

          <Button type="submit" isLoading={loadingAction}>
            Enviar
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Dashboard;
