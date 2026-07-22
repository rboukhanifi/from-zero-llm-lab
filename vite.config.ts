import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'plugin-inspect-react-code'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: './',
  plugins: [command === "serve" && inspectAttr(), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) {
            return "react";
          }
          if (
            id.includes("node_modules/framer-motion") ||
            id.includes("node_modules/motion-")
          ) {
            return "motion";
          }
          if (
            id.includes("node_modules/@radix-ui") ||
            id.includes("node_modules/react-remove-scroll") ||
            id.includes("node_modules/lucide-react")
          ) {
            return "ui";
          }
          if (id.includes("/src/sections/a/")) return "chapter-a";
          if (id.includes("/src/sections/b/")) return "chapter-b";
          if (id.includes("/src/sections/c/")) return "chapter-c";
          if (id.includes("/src/sections/d/")) return "chapter-d";
        },
      },
    },
  },
}));
