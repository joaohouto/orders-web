import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  background: #fafafa;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  > div > div {
    display: flex;
    flex-direction: column;

    > span {
      font-size: 12px;
    }
  }

  > div > div:first-child {
    > img {
      height: 60px;
      width: 100px;
      object-fit: cover;
      border-radius: 8px;
      background: #f1f1f1;
    }
  }

  @media (max-width: 800px) {
    > div {
      display: flex;
      flex-direction: column;

      > div {
        margin-top: 10px;
      }

      > div:first-child {
        margin-top: 0;
      }
    }
  }
`;
