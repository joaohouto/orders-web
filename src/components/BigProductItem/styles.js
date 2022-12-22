import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;

  display: flex;
  align-items: center;
  gap: 16px;

  > img {
    min-width: 120px;
    min-height: 100px;
    width: 120px;
    height: 100px;
    border-radius: 16px;
    object-fit: cover;
    background: #f1f1f1;
    border: 1px solid #eee;
  }

  > div {
    display: flex;
    flex-direction: column;
    width: 100%;

    > strong {
      font-size: 16px;
      color: #111;
    }

    > p {
      color: #777;
      font-size: 14px;
    }

    > div {
      display: flex;
      align-items: baseline;
      justify-content: space-between;

      margin-top: 8px;

      > span {
        color: var(--primary);
      }

      > button {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        width: 80px;
        padding: 8px;
        cursor: pointer;
        background: transparent;
        color: var(--primary);
      }
    }
  }
`;
