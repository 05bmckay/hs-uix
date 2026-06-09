import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.js",
    datatable: "src/datatable/index.js",
    form: "src/form/index.js",
    kanban: "src/kanban/index.js",
    feed: "src/feed/index.js",
    calendar: "src/calendar/index.js",
    "common-components": "src/common-components/index.js",
    utils: "src/utils/index.js",
    safe: "src/safe/index.js",
  },
  format: ["esm", "cjs"],
  external: [
    "react",
    "@hubspot/ui-extensions",
    "@hubspot/ui-extensions/crm",
    "@hubspot/ui-extensions/experimental",
  ],
  jsx: "transform",
  splitting: false,
  clean: true,
  outDir: "dist",
});
