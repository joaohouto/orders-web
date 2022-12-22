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

    > p {
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: bold;
    }

    > h3 {
      font-size: 14px;
      color: #777;
      font-weight: normal;
    }

    > img {
      height: 200px;
      width: 320px;
      object-fit: cover;
      border-radius: 16px;
      background: #f1f1f1;
      margin-bottom: 16px;
    }
  }

  @media (max-width: 800px) {
    flex-direction: column;

    > div {
      width: 100%;
    }

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
