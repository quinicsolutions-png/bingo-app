import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// The app has mounted — hide the splash now instead of waiting out the
// fixed timer in index.html (which remains as a safety net for slow devices).
document.getElementById("splash")?.classList.add("hidden");
