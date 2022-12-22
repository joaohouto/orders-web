import styled from "styled-components";

export const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
  position: relative;
`;

export const IconContainer = styled.button`
  position: absolute;
  right: 0;
  background: transparent;
`;

export const InputElement = styled.input`
  box-sizing: border-box;
  height: 40px;
  width: 100%;
  padding-left: 25px;
  padding-right: 25px;
  font-size: 14px;
  border-radius: 20px;

  border: 1px solid #ddd;
  background: #fff;
  color: #222;

  outline: 0;
  transition: box-shadow 0.2s ease-in-out;

  :focus {
    box-shadow: 0 0 0px 3px rgba(0, 0, 0, 0.1);
  }
`;
