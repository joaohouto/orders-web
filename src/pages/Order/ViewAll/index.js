import React, { useRef, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { IconEdit, IconTrash, IconInfoCircle } from "@tabler/icons";

import { useToast } from "../../../hooks/toast";
import api from "../../../services/api";

import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import Loader from "../../../components/Loader";
import OrderItem from "../../../components/OrderItem";
import { Container, Content, Row, MessageBox, Grid } from "./styles";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [orders, setOrders] = useState([]);

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

      const response = await api.get(`/orders/`);

      setOrders(response.data.orders);
      console.log(response.data.orders);
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
        <h2>Pedidos</h2>

        <Grid>
          <div>
            <h3>⏳ Aguardando</h3>

            {orders?.map((item) => (
              <OrderItem
                key={item._id}
                table={item.table}
                product={item.product}
                quantity={item.quantity}
                observations={item.observations}
                status={item.status}
              />
            ))}
          </div>

          <div>
            <h3>👨‍🍳 Preparando</h3>
          </div>

          <div>
            <h3>✅ Pronto</h3>
          </div>
        </Grid>
      </Content>
    </Container>
  );
};

export default Dashboard;
