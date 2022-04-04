import App from "./App";
import { BrowserRouter } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import ReactDOM from "react-dom";
import { StrictMode } from "react";
import axios from "axios";

axios.defaults.baseURL = `${window.location.origin}/api/v1`;
axios.defaults.headers.common["Content-Type"] = "application/json";

ReactDOM.render(
  <StrictMode>
    <GlobalStyles />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);
