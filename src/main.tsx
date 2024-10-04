import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// import Handwriting from "./Handwriting";
import Adjectives from "./AdjectivesNeumorph";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Adjectives />
  </StrictMode>,
);
