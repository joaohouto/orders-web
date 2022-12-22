import React from "react";
import { useHistory } from "react-router-dom";

import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import { Container, Content, Row, Grid } from "./styles";
import { IconToolsKitchen2, IconUser } from "@tabler/icons";

const Dashboard = () => {
  const history = useHistory();

  return (
    <Container>
      <Header />

      <Content>
        <Navbar />

        <div>
          <Row>
            <h2>Início</h2>
          </Row>

          <Grid>
            <Button onClick={() => history.push("/pedidos/novo")}>
              <IconUser size={20} />
              Garçom
            </Button>

            <Button onClick={() => history.push("/pedidos/todos")}>
              <IconToolsKitchen2 size={20} />
              Cozinha
            </Button>
          </Grid>
        </div>
      </Content>
    </Container>
  );
};

export default Dashboard;
