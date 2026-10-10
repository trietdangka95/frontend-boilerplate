# Boilerplate hardening delivery record

Date: 2026-09-11

## Scope delivered

- Standardized Node 24, matching Node types, exact test tooling, a working coverage provider, and the pre-commit hook.
- Made deployment environment validation explicit and removed the unused refresh environment setting.
- Separated the public starter from optional examples and local-only demo authentication.
- Added fail-closed production session boundaries, same-origin cookie-write checks, and direct guards inside demo routes.
- Split browser cookie clients from request-scoped server clients and isolated bearer-token stores. Validated refresh response payloads.
- Preserved the existing MUI/Tailwind token pipeline and Query/Table/Form architecture.
- Added redacted error reporting, server instrumentation, and a minimal liveness endpoint.
- Added production-browser tests across desktop/mobile and light/dark, plus an isolated local demo-auth flow.
- Fixed skip-link layout movement that caused clicks to miss their target, deferred theme interaction until initialization, and protected form values during pending mutations.
- Added CI quality/browser jobs, route-type generation for clean checkouts, report artifacts, dependency auditing, and weekly update proposals.
- Rewrote setup, migration, optional-example removal, deployment, and rollback documentation.

## Verification

Final local results: 53 test files / 144 unit and component tests passed; all 9 Chromium browser tests passed. Coverage: 87.33% statements, 87.63% lines, 81.60% functions, and 81.48% branches. Lint, typecheck, formatting, route type generation, production Webpack build, and Git whitespace checks passed. The production dependency audit reported no known vulnerabilities after updating the transitive sharp dependency. GitHub-hosted CI has been configured but was not dispatched from this task.

The browser suite covers keyboard focus without layout shift, theme switching, navigation, form validation and successful submissions, modal dismissal, cache synchronization, table filtering/sorting/pagination, mobile overflow, console errors, private API denial, production demo denial, and local demo login/logout.

The unit/component suite covers token-store isolation, refresh validation, query behavior, environment validation, auth boundaries, shared components, and styling contracts. Coverage includes untested application files and enforces 80% statements/lines/functions and 70% branches.

Local browser verification uses Chromium and the supported Webpack option because this host prevents Turbopack's internal worker from binding its required port. Turbopack remains the repository and CI default. Browser reports are generated in playwright-report/ and test-results/ and are intentionally ignored by Git and lint.

## Deliberately application-specific

- Connect a real identity provider and backend before storing private user data. The default session resolver denies access.
- Implement business authorization, tenant isolation, rate limits, email flows, token rotation/revocation, and persistence with that backend.
- Connect a monitoring provider and choose a hosting platform; no external account or deployment is created here.
- The records transport remains a clearly labeled in-memory example. Optional examples have a manual removal guide to avoid deleting derived-project code automatically.

Existing working-tree changes are preserved. This delivery does not create commits or deploy the application.

## Sources

- [Next.js type generation](https://nextjs.org/docs/app/api-reference/cli/next#next-typegen-options)
- [Next.js smooth-scroll navigation contract](https://nextjs.org/docs/messages/missing-data-scroll-behavior)
- [MUI color-scheme initialization](https://mui.com/material-ui/customization/dark-mode/)
- [Auth decisions and migration](../adr/0001-auth-and-examples.md)
