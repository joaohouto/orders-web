import React, { useEffect, useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

import { IconInfoCircle } from "@tabler/icons";

import { useToast } from "../../hooks/toast";
import api from "../../services/api";

import CategoryItem from "../../components/CategoryItem";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import SearchInput from "../../components/SearchInput";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import { Container, Content, Row, MessageBox } from "./styles";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

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

      const response = await api.get(`/categories`, {
        params: {
          name: query,
        },
      });

      setCategories(response.data.categories);
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
            <h2>Categorias</h2>
            <Button onClick={() => history.push("/categorias/novo")}>
              Nova +
            </Button>
          </Row>

          <SearchInput
            placeholder="Pesquisar"
            onClick={getData}
            style={{ marginBottom: 20 }}
          />

          {loading ? (
            <Loader />
          ) : categories?.length > 0 ? (
            categories?.map((item) => (
              <CategoryItem
                key={item._id}
                name={item.name}
                icon={item.icon}
                onClick={() => history.push(`/categorias/v/${item._id}`)}
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
