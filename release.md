# Release Draft

Current version: `1.6.1`

Recommended bump: `patch`

Suggested command:

```bash
npm run release:patch
```

Suggested next version: `1.6.2`

## GitHub Release Notes

```md
### Docs
- **Kanban:** Add a full package-level README at `packages/kanban/README.md` mirroring the DataTable and FormBuilder docs — Quick Start, worked examples (HubSpot Deals preset + metrics, compact lead board, per-stage load more, stage transition prompts via `onEnterRequired`, selection + bulk actions, `KanbanCardActions`, sharing a config with DataTable via `deriveCardFieldsFromColumns`, sorting, server-driven boards), and a complete API reference for Kanban props, `KanbanStage`, `KanbanCardField`, `KanbanCardActions`, filters, sort options, stage meta, metric items, and labels.
- **README:** Point the Kanban row in the root README's component table at `packages/kanban/README.md` (matching how DataTable and FormBuilder are linked).
```

## Pre-Release Checklist

- Run `npm run build`
- Review `git diff` for any unrelated workspace changes before tagging
- Commit the release-ready changes
- Run `npm run release:patch`
- Create the GitHub release using the notes above
