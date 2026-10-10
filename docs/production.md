# Deployment checklist

This repository provides a tested foundation. The target application's backend, identity provider, business authorization, and operational accounts remain deployment-specific.

## Before release

- Use Node 24 LTS and the pinned pnpm version. Install from the frozen lockfile.
- Supply HTTPS NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_API_BASE_URL when building. Set NEXT_PUBLIC_APP_ENV=production or staging. Do not deploy test settings.
- Connect resolveSession to a real identity provider and test user/tenant/role boundaries. Every data route must authorize independently of proxy.
- Replace local example services before storing user data. Registration, email, refresh-token rotation, revocation, and rate limiting must be implemented by the selected backend/provider.
- Store secrets in the deployment platform's secret manager. Never expose them through NEXT_PUBLIC variables.
- Review public route allowlists, webhook verification, trusted origins, proxy headers, and CSP connect-src for the chosen infrastructure.
- Run unit tests, coverage, lint, typecheck, formatting, production build, and browser tests. Review dependency advisories rather than suppressing audit output.
- Configure the reportError sink for monitoring and alerts. The default event excludes messages, stack traces, URLs, headers, and user payloads; the host/framework can have separate logs that require their own redaction and retention policy.
- Check /api/health for liveness. Add bounded dependency readiness checks only once those dependencies exist; do not expose credentials or internal topology.
- Verify keyboard navigation, mobile layout, light/dark mode, and error recovery against the deployed hostname.

## Deploy and rollback

Deploy an immutable build to staging, run smoke checks, then promote a separately configured production build. Public environment variables are baked into client bundles. Keep the previous known-good artifact and environment configuration so rollback is a redeploy, not a source rewrite. Validate backend compatibility before promotion or rollback.

CI does not deploy or create external monitoring accounts. Hosting-specific Docker/adapter configuration should be selected for the actual target platform.

## Maintenance

Dependabot opens weekly updates. Review coupled Next/ESLint, React/types, and Vitest/coverage changes together. Use supported stable versions, rerun browser tests, and retain failing traces for diagnosis. Changes to auth, storage, routes, and design tokens need an explicit migration note.
