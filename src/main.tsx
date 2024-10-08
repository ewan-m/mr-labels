import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// import Handwriting from "./Handwriting";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Adjectives from "./AdjectivesV2";
import { useStore } from "./useStore";

const App = () => {
  const store = useStore();

  if (store.status === "pending") {
    return <p style={{ textAlign: "center", width: "100%" }}>Loading...</p>;
  }

  if (store.status === "error") {
    return <p style={{ textAlign: "center", width: "100%" }}>Error...</p>;
  }

  return <Adjectives initialData={store.data.record} />;
};

const WithProviders = () => {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WithProviders />
  </StrictMode>,
);
