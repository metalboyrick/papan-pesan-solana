import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// @solana/web3.js + anchor expect a Node-style `Buffer` and `process` global in
// the browser. These two define/resolve shims make them available without extra
// polyfill packages, which keeps the setup beginner-friendly.
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
    global: "globalThis",
  },
  resolve: {
    alias: {
      // Some deps import "buffer" — map it to the browser build provided by vite.
    },
  },
});
