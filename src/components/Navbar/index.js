import React from "react";
import { useLocation, Link } from "react-router-dom";

import { IconHome, IconBarcode, IconArchive, IconReceipt } from "@tabler/icons";

import { Container, NavItem, Info } from "./styles";

const Navbar = () => {
  const location = useLocation();

  return (
    <Container>
      <ul>
        <NavItem active={location.pathname === "/"}>
          <Link to="/">
            <IconReceipt size={25} /> Pedidos
          </Link>
        </NavItem>

        <NavItem active={location.pathname.includes("/categorias")}>
          <Link to="/categorias">
            <IconArchive size={25} /> Categorias
          </Link>
        </NavItem>

        <NavItem active={location.pathname.includes("/produtos")}>
          <Link to="/produtos">
            <IconBarcode size={25} /> Produtos
          </Link>
        </NavItem>
      </ul>
    </Container>
  );
};

export default Navbar;
