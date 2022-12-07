import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from "path";

export default defineConfig({
  plugins: [solidPlugin()],
  base: "",
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    outDir: 'docs',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
      "~@": path.resolve(__dirname, "/src"),
    }
  }
});
