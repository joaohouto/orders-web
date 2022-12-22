import styled from "styled-components";

export const InputBox = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  position: relative;
`;

export const IconContainer = styled.button`
  position: absolute;
  right: 24px;
  background: transparent;
  cursor: pointer;

  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InputElement = styled.input`
  box-sizing: border-box;
  height: 40px;
  width: 100%;
  padding: 8px 24px;
  font-size: 16px;
  border-radius: 16px;

  border: 1px solid #ddd;
  background: #fff;
  color: #222;

  outline: 0;
  transition: box-shadow 0.2s ease-in-out;

  :focus {
    box-shadow: 0 0 0px 3px rgba(0, 0, 0, 0.1);
  }
`;
