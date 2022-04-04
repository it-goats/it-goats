import "react-datepicker/dist/react-datepicker.css";

import App from "./App";
import GlobalStyles from "./styles/GlobalStyles";
import ReactDOM from "react-dom";
import { StrictMode } from "react";
import axios from "axios";

axios.defaults.baseURL = `${window.location.origin}/api/v1`;
axios.defaults.headers.common["Content-Type"] = "application/json";

ReactDOM.render(
  <StrictMode>
    <GlobalStyles />
    <App />
  </StrictMode>,
  document.getElementById("root")
);
