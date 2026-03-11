import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["d20.svg"],
      manifest: {
        name: "RPG Puzzle Generator",
        short_name: "Puzzle Gen",
        description: "Generate logically coherent, GM-usable RPG puzzle seeds",
        theme_color: "#1a1a2e",
        background_color: "#0a0a1a",
        display: "standalone",
        icons: [
          {
            src: "d20.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
