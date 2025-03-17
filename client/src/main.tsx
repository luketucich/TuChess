import { createRoot } from "react-dom/client";
import ChessRoom from "./components/ChessRoom";
import Header from "./components/Header";

createRoot(document.getElementById("root")!).render(
  <>
    <Header />
    <ChessRoom />
  </>
);
