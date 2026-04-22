import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.js"],
  format: ["esm", "cjs"],
  external: ["react", "@hubspot/ui-extensions"],
  jsx: "transform",
  splitting: false,
  clean: true,
});
