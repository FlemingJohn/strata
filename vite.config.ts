import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@types": resolve(__dirname, "src/types"),
      "@constants": resolve(__dirname, "src/constants"),
      "@rendering": resolve(__dirname, "src/rendering"),
      "@game": resolve(__dirname, "src/game"),
      "@chain": resolve(__dirname, "src/chain"),
      "@interface": resolve(__dirname, "src/interface")
    }
  },
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: "dist",
    target: "es2022"
  }
});
