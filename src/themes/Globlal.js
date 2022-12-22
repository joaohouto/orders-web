import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 15px;
    height: 15px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 0px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgb(218, 220, 224);
    background-clip: padding-box;
    border-image: initial;
    border-style: solid;
    border-color: transparent;
    border-width: 4px;
    border-radius: 8px;
  }

  ::-webkit-scrollbar-button {
    height: 0px;
    width: 0px;
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  :root{
    --primary: #D73035;
    --primary-transparent: rgba(215, 48, 53, 0.2);
    --danger: #DF3030;
    --danger-transparent: rgba(223, 48, 48, 0.2);
    --success: #3CA422;
    --success-transparent: rgba(60, 164, 34, 0.2);
    --warning: #FFA800;
    --warning-transparent: rgba(255, 168, 0, 0.2);
  }

  * {
    font-family: "Inter", sans-serif !important;
    margin: 0;
    padding: 0;
    border: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    display: flex;
    flex-direction: column;
  }

  a {
    color: var(--primary);
    font-weight: bold;
    text-decoration: none;
  }

  button {
    transition: opacity 0.4s all;
  }
`;

export default GlobalStyle;
