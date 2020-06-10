import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "store";
import "./index.css";
import "antd/dist/antd.css";
import Root from "pages";

ReactDOM.render(
  <BrowserRouter>
    <AppProvider>
      <Root /> {/*  /pages/index.js */}
    </AppProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
