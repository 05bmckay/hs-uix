# Releasing hs-uix

All releases go through the root `hs-uix` package. The subpackages (`@hs-uix/form`, `@hs-uix/datatable`) are deprecated — everything publishes from the monorepo root.

## Quick Release

From the repo root:

```bash
npm run release:patch    # bug fix:      1.2.3 → 1.2.4
npm run release:minor    # new feature:  1.2.3 → 1.3.0
npm run release:major    # breaking:     1.2.3 → 2.0.0
```

This single command does everything:
1. `npm version patch` — bumps `package.json`, creates a version commit and git tag
2. `npm publish` — triggers `prepublishOnly` (tsup build), then publishes to npm
3. `git push origin main --tags` — pushes the commit and tag to GitHub

## Step-by-Step (if you need more control)

### 1. Commit your changes

```bash
git add <files>
git commit -m "fix: description of changes"
```

### 2. Bump version and publish

```bash
npm run release:patch   # or release:minor / release:major
```

### 3. Create GitHub release notes

After the release script completes:

```bash
gh release create v1.2.4 --title "v1.2.4" --latest --notes "$(cat <<'EOF'
### Bug Fixes
- **FormBuilder:** Description of fix

### Features
- **DataTable:** Description of feature

### Docs
- Description of doc changes
EOF
)"
```

Use the `### Bug Fixes`, `### Features`, `### Docs`, and `### Breaking Changes` headers as applicable. Prefix each item with the component name in bold (`**FormBuilder:**` or `**DataTable:**`).

## If the push fails

The release script runs `npm version && npm publish && git push` in sequence. If the publish succeeds but the push fails (e.g., remote has new commits):

```bash
git pull --rebase origin main
git push origin main --tags
```

The npm publish is already done — you just need to get the commit and tag pushed.

## Subpackage versions

The subpackages in `packages/` have their own `package.json` versions but are **not published separately**. Their version numbers are informational only. Only the root `hs-uix` version matters for npm.

## Type definitions

When adding new exported types to a subpackage's `index.d.ts`, also add them to:
- `form.d.ts` / `datatable.d.ts` (subpath re-exports)
- `index.d.ts` (root re-exports)

All three files must stay in sync.
