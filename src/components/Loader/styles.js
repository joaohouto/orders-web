import styled from "styled-components";

export const Skeleton = styled.div`
  height: 60px;
  width: 100%;
  margin-bottom: 15px;
  border-radius: 8px;
  background: #eee;
  background-image: linear-gradient(
    to right,
    #eee 0%,
    #fafafa 20%,
    #eee 40%,
    #eee 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 400px;
  display: inline-block;
  position: relative;

  animation: shimmer 1s forwards infinite linear;

  @keyframes shimmer {
    0% {
      background-position: -500px 0;
    }
    100% {
      background-position: 500px 0;
    }
  }
`;
