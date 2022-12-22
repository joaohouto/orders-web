import React, { useEffect, useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

import { IconInfoCircle } from "@tabler/icons";

import { useToast } from "../../hooks/toast";
import api from "../../services/api";

import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import SearchInput from "../../components/SearchInput";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import { Container, Content, Row, MessageBox } from "./styles";
import ProductItem from "../../components/ProductItem";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [query, setQuery] = useState("");

  const { addToast } = useToast();
  const history = useHistory();

  useEffect(() => {
    getData();
  }, []);

  const getData = async (e) => {
    e?.preventDefault();

    try {
      setLoading(true);

      const response = await api.get(`/products`, {
        params: {
          name: query,
        },
      });

      setProducts(response.data.products);
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

  return (
    <Container>
      <Header />

      <Content>
        <Navbar />

        <div>
          <Row>
            <h2>Produtos</h2>
            <Button onClick={() => history.push("/produtos/novo")}>
              Novo +
            </Button>
          </Row>

          <SearchInput
            placeholder="Pesquisar"
            onClick={getData}
            style={{ marginBottom: 20 }}
          />

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
            <MessageBox>
              <IconInfoCircle size={25} color="#777" />{" "}
              <span>Nada foi encontrado.</span>
            </MessageBox>
          )}
        </div>
      </Content>
    </Container>
  );
};

export default Dashboard;
