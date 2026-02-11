import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";
import { StoreProvider } from "./context/StoreContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StoreProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StoreProvider>
);


