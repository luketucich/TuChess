import { createRoot } from "react-dom/client";
import ChessRoom from "./components/ChessRoom";
import Header from "./components/Header";
import { AppProvider } from "./context/AppContext";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <Header />
    <ChessRoom />
  </AppProvider>
);
