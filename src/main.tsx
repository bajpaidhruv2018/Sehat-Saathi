import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./i18n";
import "./index.css";
import { registerServiceWorker } from "./utils/pwa";

console.log("🚀 SehatSaathi main.tsx is loading...");

registerServiceWorker();

const rootElement = document.getElementById("root");
console.log("📍 Root element:", rootElement);

if (!rootElement) {
    console.error("❌ Root element not found!");
} else {
    console.log("✅ Root element found, rendering app...");
    createRoot(rootElement).render(
        <ErrorBoundary>
            <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center text-lg font-semibold animate-pulse">Loading SehatSaathi...</div>}>
                <App />
            </Suspense>
        </ErrorBoundary>
    );
    console.log("✅ App render initiated");
}
