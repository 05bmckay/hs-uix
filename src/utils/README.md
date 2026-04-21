# utils

Pure helper functions for formatting, mapping, guards, and lightweight data transformations.

## Current modules

- `tagVariants.js`
- `formatters.js`
- `options.js`
- `hubspotValues.js`
- `collections.js`

## Purpose

This folder is for non-visual logic only.

Use `utils` when the export is a pure function that helps format values, build config, validate HubSpot-shaped objects, or transform data for display.

## Import path

```js
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPercentage,
  buildOptions,
  findOptionLabel,
  isDateValueObject,
  isTimeValueObject,
  isDateTimeValueObject,
  sumBy,
  getAutoTagVariant,
  getAutoStatusTagVariant,
} from "hs-uix/utils";
```

## Guidelines

- Keep helpers pure and side-effect free
- Prefer small focused utilities over broad catch-all helpers
- Put JSX wrappers in `src/common-components/`
