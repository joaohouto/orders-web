import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  padding: 30px;
  overflow: hidden;
  pointer-events: none;
  transition: all 0.4s ease-in-out;
  z-index: 2000;

  @media (max-width: 800px) {
    width: 100%;
  }
`;
