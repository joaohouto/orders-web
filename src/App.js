import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import AppProvider from "./hooks";
import Routes from "./routes/index";
import GlobalStyle from "./themes/Globlal";

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <AppProvider>
        <Routes />
      </AppProvider>
    </Router>
  );
};

export default App;
