import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

export const Content = styled.div`
  display: flex;

  > div {
    width: 750px;
    padding: 40px;

    > div > h2 {
      font-size: 40px;
    }
  }

  @media (max-width: 800px) {
    flex-direction: column;

    > div {
      width: 100%;

      > div > h2 {
        font-size: 25px;
      }
    }
  }
`;

export const Row = styled.div`
  width: 100%;
  margin-bottom: 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MessageBox = styled.div`
  width: 100%;
  min-height: 200px;

  display: flex;
  justify-content: center;
  align-items: center;

  > span {
    margin-left: 10px;
    font-weight: bold;
    color: #777;
  }
`;
