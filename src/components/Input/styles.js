import styled from "styled-components";

export const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  position: relative;
  width: auto;
`;

export const InputLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  color: #777;
  margin-bottom: 8px;
`;

export const InputElement = styled.input`
  height: 40px;
  width: auto;
  padding: 8px 24px;
  font-size: 16px;
  border-radius: 8px;

  border: ${(props) =>
    props.isErrored ? "1px solid #EE6666" : "1px solid #ddd"};
  background: #fff;
  color: #111;
  transition: box-shadow 0.2s ease-in-out;

  :focus {
    box-shadow: 0 0 0px 3px rgba(0, 0, 0, 0.1);
  }

  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  outline: 0;
`;

export const WarningText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #ee6666;
  position: absolute;
  top: 0;
  right: 0;

  animation: wiggle 0.8s;
  @keyframes wiggle {
    0% {
      transform: translateX(0px);
    }
    33% {
      transform: translateX(10px);
    }
    66% {
      transform: translateX(-10px);
    }
    100% {
      transform: translateX(0px);
    }
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 16px;
  bottom: 6px;
`;
