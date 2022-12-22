import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    width: 50%;
    padding: 40px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (max-width: 800px) {
      width: 100%;
    }

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 16px;
    }
  }

  > div form {
    width: 80%;

    @media (max-width: 800px) {
      width: 100%;
    }

    > div {
      width: 100%;
    }

    > span {
      color: #999;
      margin-bottom: 20px;
    }

    > a {
      font-weight: normal;
    }

    h1 {
      margin: 30px 0;
      font-size: 40px;
    }

    button {
      width: 100%;
    }
  }

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;
