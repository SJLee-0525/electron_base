import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";

import App from "@renderer/App";

// MSW 적용 (개발 모드일 때만)
if (import.meta.env.DEV) {
  const { worker } = await import("@renderer/mocks/browser"); 
  await worker.start({
    onUnhandledRequest: "warn", // 요청 누락 경고
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

