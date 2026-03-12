import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

/* ── Suppress noisy third-party radar widget messages ── */
(function () {
  const BLOCKED = [
    "isInApp", "wrVersion", "platform desktop",
    "WetterOnline", "++++", "using deprecated parameters",
    "Starting theme helper", "map-container", "map-resize",
    "text-layer", "worker to fetch svg", "chunk-",
  ];
  const noisy = (args) => {
    const msg = String(args[0] ?? "");
    return BLOCKED.some((t) => msg.includes(t));
  };
  const wrap = (fn) => (...args) => { if (!noisy(args)) fn.apply(console, args); };
  console.log   = wrap(console.log);
  console.warn  = wrap(console.warn);
  console.info  = wrap(console.info);
  // keep console.error intact so real errors surface
})();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
