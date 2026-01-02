import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./i18n";
import "./index.css";
import { registerServiceWorker } from "./utils/pwa";

registerServiceWorker();

createRoot(document.getElementById("root")!).render(
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center text-lg font-semibold animate-pulse">Loading SehatSaathi...</div>}>
        <App />
    </Suspense>
);
