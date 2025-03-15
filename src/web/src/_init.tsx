import ReactDOM from "react-dom/client";
import { AppRouter } from "./AppRouter";

ReactDOM
    .createRoot( document.getElementById("app") as Element )
    .render(<AppRouter />);
