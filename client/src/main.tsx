import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import pkg from "react-helmet-async/lib/index.js";
const { HelmetProvider } = pkg;

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
