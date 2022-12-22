import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

export const Content = styled.div`
  padding: 32px;

  > h2 {
    font-size: 40px;
  }
`;

export const Row = styled.div`
  width: 100%;
  margin-bottom: 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CategoryRow = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  padding: 8px 0;
  margin-bottom: 24px;
  gap: 16px;

  display: flex;
  align-items: center;
`;

export const CategoryItem = styled.button`
  padding: 8px 24px;
  border-radius: 24px;
  background: ${(p) => (p.isActive ? "var(--primary)" : "#fff")};
  filter: drop-shadow(0 0px 4px rgba(0, 0, 0, 0.1));

  display: flex;
  align-items: center;

  cursor: pointer;

  > b {
    font-size: 20px;
    margin-right: 8px;
  }

  > span {
    color: ${(p) => (p.isActive ? "#fff" : "#111")};
  }
`;
