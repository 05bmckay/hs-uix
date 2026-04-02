import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.js"],
  format: ["esm", "cjs"],
  external: ["@hs-uix/datatable"],
  splitting: false,
  clean: true,
});
