import React, { useState } from "react";
import { IconChevronDown } from "@tabler/icons";

import { Button, Container, Wrapper, Content } from "./styles";

const Accordion = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container>
      <Button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
      >
        {label}
        <IconChevronDown
          size={24}
          style={{
            transform: `rotate(${isOpen ? -180 : 0}deg)`,
            transition: "transform 0.35s",
          }}
        />
      </Button>

      <Wrapper itemName={label} isActive={isOpen}>
        <Content id={label}>{children}</Content>
      </Wrapper>
    </Container>
  );
};

export default Accordion;
