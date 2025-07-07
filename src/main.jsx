import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.jsx";
import "./index.css";

const container = document.getElementById("root");

if (!container._root) {
  container._root = createRoot(container);
}

container._root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
