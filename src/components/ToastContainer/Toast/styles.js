import styled, { css } from "styled-components";

const toastTypeVariations = {
  info: css`
    border-left: 6px solid var(--info);

    > div {
      > svg {
        color: var(--info);
      }
    }
  `,
  success: css`
    border-left: 6px solid var(--success);

    > div {
      > svg {
        color: var(--success);
      }
    }
  `,
  error: css`
    border-left: 6px solid var(--danger);

    > div {
      > svg {
        color: var(--danger);
      }
    }
  `,
};

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  width: 350px;
  height: auto;
  background: #fafafa;
  padding: 16px 24px;
  border-radius: 16px;
  margin-bottom: 20px;
  cursor: pointer;
  pointer-events: all;
  animation: push 0.4s ease-in-out;
  filter: drop-shadow(0px 0px 16px rgba(0, 0, 0, 0.15));

  @keyframes push {
    from {
      transform: translateX(50px);
      opacity: 0;
    }

    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  ${(props) => toastTypeVariations[props.type || "info"]}

  strong {
    font-size: 16px;
    color: #222;
  }

  p {
    font-size: 14px;
    color: #777;
  }

  > div {
    display: flex;
    align-items: center;

    > svg {
      margin-right: 20px;
      min-width: 30px;
    }
  }

  > svg {
    min-width: 15px;
  }

  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const Line = styled.div`
  height: 30px;
  width: 5px;
  border-radius: 3px;
`;
