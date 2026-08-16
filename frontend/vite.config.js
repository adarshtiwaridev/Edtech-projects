import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom", "@reduxjs/toolkit", "framer-motion"],
          charts: ["chart.js", "react-chartjs-2"],
          icons: ["lucide-react", "react-icons"],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});