import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* declared locally so the config stays free of a @types/node dependency */
declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
  plugins: [react()],
  server: {
    // use an assigned port when one is handed down, else vite's default
    port: Number(process.env.PORT) || 5173,
  },
});
