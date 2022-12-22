import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
  border: 1px solid #eee;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 14px;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;

    > strong {
      font-size: 18px;
      color: #222;
    }

    > span {
      font-size: 14px;
      color: #999;
    }
  }
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 40px;
  width: 30px;
  background: transparent;
  border-radius: 8px;
`;
