import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* declared locally so the config stays free of a @types/node dependency */
declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /*
          three is ~60% of the bundle and changes only when the dependency is
          upgraded, so giving it its own chunk means a normal deploy invalidates
          the small app chunk and returning visitors keep the big one cached.
        */
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("/three/")) return "three";
          if (
            id.includes("@react-three") ||
            id.includes("/postprocessing/") ||
            id.includes("/maath/")
          ) {
            return "three-react";
          }
          if (id.includes("/react-dom/") || id.includes("/react/")) {
            return "react";
          }
        },
      },
    },
  },
  server: {
    // use an assigned port when one is handed down, else vite's default
    port: Number(process.env.PORT) || 5173,
  },
});
