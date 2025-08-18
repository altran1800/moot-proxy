import { join } from "path";
import pkg from "./package.json";
import { defineNitroConfig } from "nitropack";

export default defineNitroConfig({
  preset: "node-server",  // Node server ESM preset
  compatibilityDate: "2025-04-20",
  srcDir: "./src",
  runtimeConfig: {
    version: pkg.version
  },
  alias: {
    "@": join(__dirname, "src")
  }
});
