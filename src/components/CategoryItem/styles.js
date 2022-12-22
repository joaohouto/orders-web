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
    grid-template-columns: 36px 1fr;
    gap: 16px;
  }

  > div > div {
    display: flex;
    flex-direction: column;

    > span {
      font-size: 12px;
    }
  }

  > div > div:first-child {
    display: flex;
    align-items: center;
    justify-content: center;

    > span {
      font-size: 24px;
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
