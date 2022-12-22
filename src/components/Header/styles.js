import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  background: #fff;
  color: #111;
  padding: 16px 32px;
  border-bottom: 1px solid #eee;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  > h1 {
    color: #fafafa;
    font-size: 20px;
    margin-right: 20px;

    display: flex;
    justify-content: center;
    align-items: center;

    > img {
      height: 32px;
    }
  }

  > button {
    padding: 10px 20px;
    border-radius: 8px;
    margin-left: 20px;
    font-size: 16px;
    background: #333;
    color: #fff;
    cursor: pointer;
  }
`;

export const Dropdown = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  > button {
    display: flex;
    justify-content: center;
    align-items: center;

    background: transparent;
    margin-left: 10px;
    height: 30px;
    width: 30px;
    border-radius: 8px;
    cursor: pointer;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;

  strong {
    font-size: 16px;
    color: #111;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    font-size: 14px;
    color: #999;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 800px) {
    display: none;
  }
`;

export const DropdownContent = styled.div`
  background: #333;
  padding: 10px;
  width: 260px;
  border-radius: 12px;
  position: absolute;
  top: 75px;
  right: 0;

  transition: all 0.35s;

  > button {
    width: 100%;
    padding: 8px 16px;
    cursor: pointer;
    text-align: left;
    background: none;
    color: #f1f1f1;
  }
`;

export const UserButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 46px;
  min-width: 46px;
  background: var(--primary-transparent);
  color: var(--primary);
  font-weight: bold;
  font-size: 20px;
  border-radius: 50%;
  margin-right: 15px;

  @media (max-width: 800px) {
    margin-right: 0;
  }
`;
