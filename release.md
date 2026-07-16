# Release — hs-uix@2.3.1

Published: 2026-07-16

Release type: `patch`

This is a documentation and tooling release with no runtime API changes.

## GitHub release notes

```md
### Documentation
- **Roadmap:** Reconcile shipped stable and experimental features and document graduation gates for Wizard/OnboardingChecklist, Skeleton, and DataTable row expansion.
- **Icon:** Clarify native Icon versus SVG/Image fallback behavior, exact name resolution, layout constraints, accessibility expectations, and supported Button/Link compositions.
- **Experimental APIs:** Add a source-backed graduation audit with explicit defer decisions and migration policies.
- **Release process:** Add guarded preflight, verification, and partial-failure recovery guidance.

### Tooling
- **CI:** Validate Node 22 and Node 24 with clean install, tests, production build, and package dry-run on pushes and pull requests.
- **Build:** Declare TypeScript explicitly so clean tsup builds do not depend on a transitive installation.
```

## Verification

- [x] npm published `hs-uix@2.3.1`
- [x] npm `latest` points to `2.3.1`
- [x] Version commit `cd366cd` pushed to `main`
- [x] Tag `v2.3.1` pushed to GitHub
- [x] GitHub Actions passed on Node 22 and Node 24
- [x] GitHub release created: https://github.com/05bmckay/hs-uix/releases/tag/v2.3.1
