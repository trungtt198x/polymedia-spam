import ReactDOM from "react-dom/client";
import "normalize.css";
import { AppRouter } from "./AppRouter";

ReactDOM.createRoot(document.getElementById("app") as Element).render(
  <AppRouter />,
);
