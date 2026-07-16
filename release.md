# Release Draft — hs-uix@2.3.1 (blocked)

Current published/local version: `2.3.0`

Target version: `2.3.1`

Recommended bump: `patch` — documentation and release-process improvements only; no runtime API changes.

## Blocker

`npm whoami` currently returns `E401 Unauthorized`. Do **not** run `npm version`, create `v2.3.1`, or run a release script until npm authentication succeeds. The release scripts version and tag before publishing, so an authentication failure would leave a partial local release state.

## Proposed release notes

```md
### Documentation
- **Roadmap:** Reconcile shipped stable and experimental features and document graduation gates for Wizard/OnboardingChecklist, Skeleton, and DataTable row expansion.
- **Icon:** Clarify native Icon versus SVG/Image fallback behavior, exact name resolution, layout constraints, accessibility expectations, and supported Button/Link compositions.
- **Release process:** Add guarded preflight, verification, and partial-failure guidance.

### Tooling
- **CI:** Validate Node 22 and Node 24 with clean install, tests, production build, and package dry-run on pushes and pull requests; declare TypeScript explicitly so clean tsup builds do not depend on a transitive install.
```

The expanded `src/common-components/README.md` is included in the npm payload. `CHANGELOG.md`, `ROADMAP.md`, `release.md`, `RELEASING.md`, and files under `docs/` are repository documentation and are not packed.

## Pre-release checklist

- [ ] `npm whoami` succeeds for an account authorized to publish `hs-uix`
- [ ] `npm view hs-uix version` still reports `2.3.0`
- [ ] `main` is clean, synchronized with `origin/main`, and includes all intended changes
- [ ] `npm ci`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm pack --dry-run` and inspect package contents
- [ ] Convert the `CHANGELOG.md` `Unreleased` section to `2.3.1 — <actual publish date>`
- [ ] Commit release-ready documentation
- [ ] Run `npm run release:patch`
- [ ] Verify npm reports `2.3.1` as `latest`
- [ ] Verify the version commit and `v2.3.1` tag are on GitHub
- [ ] Create the GitHub release from the reviewed notes above

See [`RELEASING.md`](./RELEASING.md) for the guarded workflow and recovery guidance.
