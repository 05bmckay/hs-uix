# Releasing hs-uix

`hs-uix` is one publishable root package with subpath exports such as `hs-uix/datatable`, `hs-uix/form`, and `hs-uix/common-components`. The old scoped `@hs-uix/*` packages are deprecated registry artifacts, not active workspaces. Every public subpath shares the root package version.

## Release scripts

From the repository root:

```bash
npm run release:patch    # bug fix or documentation-only patch: 2.3.0 → 2.3.1
npm run release:minor    # backward-compatible feature:          2.3.0 → 2.4.0
npm run release:major    # breaking change:                      2.3.0 → 3.0.0
```

Each script expands to:

1. `npm version <level>` — updates `package.json` and `package-lock.json`, creates a version commit, and creates a git tag.
2. `npm publish` — runs `prepublishOnly` (`tsup`) and publishes the root package.
3. `git push origin main --tags` — pushes the version commit and tag.

Because versioning happens before publication, run the complete preflight before invoking a release script.

## Preflight

Stop on any failure:

```bash
git fetch origin
git status --short --branch
git rev-list --left-right --count origin/main...HEAD

npm whoami
npm view hs-uix version dist-tags --json

npm ci
npm test
npm run build
npm pack --dry-run
```

Before releasing, confirm:

- the npm identity is authorized to publish `hs-uix`;
- the working tree is clean and `main` has no divergence from `origin/main`;
- the intended version is not already present on npm;
- tests and both ESM/CJS builds pass;
- the package dry-run contains the expected `dist`, declaration, and documentation files;
- `CHANGELOG.md` and `release.md` describe the actual release scope.

## Publish and verify

Run exactly one appropriate release command:

```bash
npm run release:patch
```

Then verify every external side effect:

```bash
npm view hs-uix version dist-tags --json
git show --stat v2.3.1
git ls-remote --tags origin refs/tags/v2.3.1
```

Create the GitHub release only after npm and the remote tag are verified:

```bash
gh release create v2.3.1 \
  --title "v2.3.1" \
  --latest \
  --notes-file <reviewed-notes-file>
```

Do not pass the working `release.md` draft directly while it still contains
status, blockers, or checklist content. Prefer reviewed release notes containing only the relevant `### Bug Fixes`, `### Features`, `### Documentation`, `### Tooling`, and `### Breaking Changes` sections.

## Failure recovery

First determine which side effects completed. Never rerun the entire release command blindly.

### Publish succeeded, push failed

If npm already reports the new version, do not publish again. Preserve the tagged
version commit while incorporating any remote commits with a merge:

```bash
git fetch origin
git merge --no-edit origin/main
git merge-base --is-ancestor v2.3.1 HEAD
git push origin main --tags
```

The ancestry check must succeed before pushing. Do not rebase the version commit
while its tag still points to the original commit; that can detach the release tag
from the version commit on `main`. If the merge conflicts or the ancestry check
fails, stop and resolve the branch/tag relationship explicitly.

### Version commit/tag created, publish failed

Confirm npm does **not** contain the new version before cleanup. If the generated version commit/tag are local-only and no other work followed them, remove them deliberately:

```bash
npm view hs-uix versions --json
git status --short --branch
git show --stat HEAD
git tag --points-at HEAD

# Only after verifying the failed release commit is local-only:
git tag -d v2.3.1
git reset --hard HEAD^  # destructive: use only for the isolated generated version commit
```

Restore npm authentication, rerun the full preflight, and release once. Never delete a tag that has been pushed or a version that exists on npm.

## Type declarations and exports

Runtime exports, package subpaths, build entries, and hand-written declarations must stay synchronized:

- Component runtime: `src/<component>/index.js`
- Component declarations: usually `src/<component>/index.d.ts`
- Root subpath shim: `<component>.d.ts`
- Root barrel runtime/types: `src/index.js` and `index.d.ts` when the symbol is root-exported
- Package export/build entries: `package.json` and `tsup.config.js` for a new subpath

`common-components.d.ts` and `utils.d.ts` are direct declaration entry points and must be updated when those stable surfaces change.
