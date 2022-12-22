import React, { useRef, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { IconEdit, IconTrash, IconInfoCircle } from "@tabler/icons";

import { useToast } from "../../../hooks/toast";
import api from "../../../services/api";

import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import { Container, Content, Row, MessageBox } from "./styles";
import formatNumber from "../../../utils/formatNumber";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [product, setProduct] = useState({});

  const { addToast } = useToast();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    getData();
  }, []);

  const getData = async (e) => {
    e?.preventDefault();

    try {
      setLoading(true);

      const response = await api.get(`/products/${id}`);

      setProduct(response.data.product);
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

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza? A ação não poderá ser desfeita.")) return;

    try {
      setLoadingAction(true);

      await api.delete(`/products/${id}`);

      addToast({
        type: "success",
        title: "Feito!",
        description: "Item excluído.",
      });

      history.goBack();
    } catch (err) {
      console.log(err);

      addToast({
        type: "error",
        title: "Erro!",
        description: err.response?.data.message || "Algo deu errado!",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <Container>
      <Header />

      <Content>
        <Navbar />

        <div>
          <Row>
            <h2>Produto</h2>

            <div>
              <Button isLoading={loadingAction} onClick={handleDelete}>
                <IconTrash size={20} color="#999" style={{ marginRight: 10 }} />
                Excluir
              </Button>

              <Button onClick={() => history.push(`/produtos/e/${id}`)}>
                <IconEdit size={20} color="#fff" style={{ marginRight: 10 }} />
                Editar
              </Button>
            </div>
          </Row>

          {loading ? (
            <Loader />
          ) : product ? (
            <>
              <img src={product.imageUrl} alt="Imagem" />

              <h3>Nome</h3>
              <p>{product.name}</p>

              <h3>Descrição</h3>
              <p>{product.description}</p>

              <h3>Categoria</h3>
              <p>{product.category.name}</p>

              <h3>Preço</h3>
              <p>R$ {formatNumber(product.price)}</p>
            </>
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
