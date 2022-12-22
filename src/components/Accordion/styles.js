import styled from "styled-components";

export const Container = styled.div`
  margin-bottom: 20px;
  padding: 0 20px;
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
`;

export const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  color: var(--primary);
  font-weight: bold;
  padding: 20px 0;
  text-transform: uppercase;
  outline: 0;
  cursor: pointer;
`;

export const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: ${(p) => {
    const inner = document.getElementById(p.itemName);
    return `${p.isActive ? inner?.clientHeight : 0}px`;
  }};
  transition: height 0.35s;
`;

export const Content = styled.div`
  position: absolute;
  width: 100%;
  input {
    :focus {
      box-shadow: none;
    }
  }
`;
