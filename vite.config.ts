import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  let groqKey = (env.VITE_GROQ_API_KEY || env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY || '').trim();
  
  // Auto-correct accidental leading 'A' if copied from Agsk_...
  if (groqKey.startsWith("Agsk_")) {
    groqKey = groqKey.substring(1);
  }

  return {
    define: {
      'import.meta.env.VITE_GROQ_API_KEY': JSON.stringify(groqKey),
      'import.meta.env.GROQ_API_KEY': JSON.stringify(groqKey),
    },
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

