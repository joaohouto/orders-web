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
  flex-direction: column;
  padding: 32px;

  > h2 {
    font-size: 40px;
  }

  @media (max-width: 800px) {
    h2 {
      font-size: 25px !important;
    }
  }
`;

export const Row = styled.div`
  width: 100%;
  margin-bottom: 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    display: flex;

    > button:first-child {
      background: none;
      color: #999;
      margin-right: 10px;
    }
  }

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: flex-start;

    > h2 {
      margin-bottom: 20px;
    }

    > div {
      flex-direction: column;
      width: 100%;

      > button {
        width: 100%;
      }

      > button:first-child {
        margin-bottom: 10px;
      }
    }
  }
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

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;

  margin-top: 32px;

  > div {
    > h3 {
      font-size: 16px;
      color: #111;
      font-weight: 600;
      margin-bottom: 24px;
    }
  }
`;
