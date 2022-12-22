import styled from "styled-components";

export const Container = styled.nav`
  width: 250px;
  height: auto;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;

  @media (max-width: 800px) {
    width: 100%;
    height: auto;
  }

  > ul {
    list-style: none;
    display: flex;
    flex-direction: column;
  }
`;

export const NavItem = styled.li`
  display: flex;

  > a {
    width: 100%;
    padding: 10px 20px;
    margin: 5px 0;
    border-radius: 16px;

    background: ${(props) => (props.active ? "var(--primary)" : "none")};
    color: ${(props) => (props.active ? "#fff" : "var(--primary)")};

    display: flex;
    align-items: center;

    > svg {
      color: ${(props) => (props.active ? "#fff" : "var(--primary)")};
      margin-right: 15px;
    }
  }
`;

export const Info = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 40px;

  > a {
    color: #999;
    font-weight: 600;
    border-bottom: 2px solid #eee;
  }
`;
