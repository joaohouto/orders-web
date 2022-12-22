import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/auth";

import { IconChevronDown } from "@tabler/icons";
import {
  Container,
  Dropdown,
  Column,
  DropdownContent,
  UserButton,
} from "./styles";

import logoImg from "../../assets/logo.svg";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <Container>
      <Link to="/">
        <h1>
          <img src={logoImg} alt="Orders" />
        </h1>
      </Link>

      <Dropdown>
        <UserButton>{user.name.split("")[0]}</UserButton>

        <Column>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </Column>

        <button onClick={() => setIsDropdownOpen((s) => !s)}>
          <IconChevronDown
            size={20}
            style={{
              transform: `rotate(${isDropdownOpen ? -180 : 0}deg)`,
              transition: "transform 0.35s",
            }}
          />
        </button>

        <DropdownContent
          style={{
            transform: isDropdownOpen ? "translateY(0px)" : "translateY(20px)",
            visibility: isDropdownOpen ? "visible" : "hidden",
            opacity: isDropdownOpen ? 1 : 0,
          }}
        >
          <button onClick={() => signOut()}>Sair</button>
        </DropdownContent>
      </Dropdown>
    </Container>
  );
};

export default Header;
