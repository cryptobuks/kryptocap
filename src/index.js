import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import Slide from "@mui/material/Slide";

import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      TransitionComponent={Slide}
    >
      <App />
    </SnackbarProvider>
  </React.StrictMode>
);
