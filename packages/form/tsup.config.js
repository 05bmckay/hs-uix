import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.js"],
  format: ["esm", "cjs"],
  external: ["react", "@hubspot/ui-extensions", "@hubspot/ui-extensions/crm"],
  jsx: "transform",
  splitting: false,
  clean: true,
});
