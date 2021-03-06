import "react-datepicker/dist/react-datepicker.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import ReactDOM from "react-dom";
import { StrictMode } from "react";
import axios from "axios";

axios.defaults.baseURL = `${
  import.meta.env.PROD ? import.meta.env.CABRA_API_URL : window.location.origin
}/api/v1`;
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
