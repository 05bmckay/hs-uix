# common-components

Reusable UI wrappers built on top of HubSpot UI Extensions primitives.

## Current components

- `AutoStatusTag`
- `AutoTag`
- `SectionHeader`
- `KeyValueList`

## Purpose

This folder is for composable visual building blocks.

Use `common-components` when the export renders JSX and wraps HubSpot primitives into a reusable display pattern.

## Import paths

```js
import { AutoStatusTag, AutoTag, SectionHeader, KeyValueList } from "hs-uix/common-components";
```

Or from the root package:

```js
import { AutoStatusTag, AutoTag, SectionHeader, KeyValueList } from "hs-uix";
```

## Guidelines

- Keep components thin and composable
- Prefer wrapping native HubSpot primitives over inventing new abstractions
- Put non-visual helper logic in `src/utils/`
