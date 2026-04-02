# hubspot-datatable (deprecated)

> **This package has moved to [`@hs-uix/datatable`](https://www.npmjs.com/package/@hs-uix/datatable).**

This package now re-exports from `@hs-uix/datatable` for backwards compatibility. It will be removed in a future version.

## Migration

```bash
npm uninstall hubspot-datatable
npm install @hs-uix/datatable
```

Then update your imports:

```diff
- import { DataTable } from "hubspot-datatable";
+ import { DataTable } from "@hs-uix/datatable";
```

Everything else stays the same — the API is identical.
