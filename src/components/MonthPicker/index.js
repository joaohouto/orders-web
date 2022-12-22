import React, { useState } from "react";
import moment from "moment";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { Container, Button } from "./styles";

export default function MonthPicker({ value, onChange }) {
  const [month, setMonth] = useState(value);

  const handleNext = () => {
    setMonth((p) => {
      const newMonth = moment(p).add(1, "M").format("YYYY-MM");
      onChange(newMonth);

      return newMonth;
    });
  };

  const handlePrevious = () => {
    setMonth((p) => {
      const newMonth = moment(p).subtract(1, "M").format("YYYY-MM");
      onChange(newMonth);

      return newMonth;
    });
  };

  return (
    <Container>
      <Button onClick={handlePrevious}>
        <IconChevronLeft size={20} color="#777" />
      </Button>

      <div>
        <span>{moment(month).format("YYYY")}</span>
        <strong>{moment(month).format("MMMM")}</strong>
      </div>

      <Button onClick={handleNext}>
        <IconChevronRight size={20} color="#777" />
      </Button>
    </Container>
  );
}
