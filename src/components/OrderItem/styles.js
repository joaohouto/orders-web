import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding: 16px;
  border: 1px solid #eee;
  margin-bottom: 16px;
  border-radius: 16px;

  display: flex;
  align-items: center;
  gap: 16px;

  > img {
    min-width: 80px;
    min-height: 70px;
    width: 80px;
    height: 70px;
    border-radius: 16px;
    object-fit: cover;
    background: #f1f1f1;
    border: 1px solid #eee;
  }

  > div {
    display: flex;
    flex-direction: column;
    width: 100%;

    > span:first-child {
      font-size: 12px;
      background: #999;
      color: #fff;
      padding: 4px 8px;
      border-radius: 16px;
      margin-bottom: 8px;
    }

    > strong {
      font-size: 16px;
      color: #111;

      > span {
        font-size: 12px;
        background: var(--primary);
        color: #fff;
        padding: 4px;
        border-radius: 16px;
      }
    }

    > p {
      color: #777;
      font-size: 14px;
    }

    > div {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #777;
      margin-top: 8px;

      > span {
        font-size: 14px;
      }
    }
  }
`;
