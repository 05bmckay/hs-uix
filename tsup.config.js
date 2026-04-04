import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.js",
    datatable: "src/datatable.js",
    form: "src/form.js",
  },
  format: ["esm", "cjs"],
  external: ["react", "@hubspot/ui-extensions", "@hubspot/ui-extensions/crm"],
  jsx: "transform",
  splitting: false,
  clean: true,
  outDir: "dist",
});
