import styled from "styled-components";

export const ButtonElement = styled.button`
  box-sizing: border-box;
  width: auto;
  height: 56px;
  padding: 8px 40px;
  font-size: 14px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  border: 0;
  background: var(--primary);
  color: #fafafa;
  text-transform: uppercase;
  font-weight: bold;
  outline: 0;
  transition: all 0.4s ease-in-out;

  filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.15));
  cursor: ${(props) => (props.isLoading ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.isLoading ? 0.6 : 1)};
  pointer-events: ${(props) => (props.isLoading ? "none" : "all")};

  :hover {
    filter: brightness(70%);
  }

  :focus {
    box-shadow: 0 0 0px 3px rgba(0, 0, 0, 0.1);
  }
`;

export const Spin = styled.div`
  width: 15px;
  height: 15px;
  opacity: 0.7;
  border: 2px solid #fff;
  border-top: 2px solid #999;
  border-radius: 50%;
  animation: 1s spin linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
