# G4 — Cloudflare Pages implementation plan (not configured)

**State:** planning only. This document does not authorize project creation, Git integration, deployment, merge, or production changes.

## Verified baseline (read-only review)
- Account ID `741b3191f8d36737072da201937f712b`.
- No `bretos-web` Pages project exists. The only Pages project is `panel-bretos-services` (`panel-bretos-services.pages.dev`), ad-hoc upload, not Git-integrated, no custom domain; it is expressly out of scope and must remain untouched.
- `main` in `lusdrey523/bretos-web` contains only the initial README commit `9694a71ba7542b29b250cc5d4e9b3054557a7ad9`; it is not a safe production branch.
- Existing G1/G2/G3 milestone branches remain separate. G3 is a static Astro site: `npm run build`, output `dist`, no adapter/server runtime required.
- The `redirects` Worker, its KV namespace, existing Pages project, DNS and production traffic are unrelated to this static preview and must not be modified.

## Recommended G5 implementation, only after a fresh exact authorization
1. **Create a new independent Pages project** (proposed name `bretos-web-preview`, pending availability and Luis's approval). Do not reuse `panel-bretos-services`.
2. **Do not use current `main` as production.** Site wording/brand/contact/legal inputs remain draft and the branch is only a design preview.
3. **Safer initial choice: Cloudflare Direct Upload from an approved built artifact** to a new project, for an explicitly preview-only deployment. This keeps the build SHA/artifact under a manual approval gate and avoids Git pushes triggering an automatic Cloudflare deployment. Record artifact checksum and CI run/SHA; archive the artifact and prior deployment identifier before each upload. Direct Upload is not automatically synchronized with future Git commits, so every update needs a new reviewed artifact and explicit release step.
4. If later choosing Git integration instead, make it a separately approved change: use a dedicated non-production preview branch as production branch for the *preview-only project*, disable/guard automatic production releases where the product settings allow, and confirm in the Cloudflare UI that branch mapping cannot publish from `main`. Git integration automatically builds/deploys pushes; never connect while `main` is README-only or designate it for the live official site.
5. Use the Astro settings documented by Cloudflare: framework preset Astro, build command `npm run build`, output directory `dist`, root directory repository root, Node version compatible with `package.json` (Node 20 used in CI). No environment secrets/bindings are needed for this static build.
6. Preview access is a decision required before G5. Cloudflare Pages preview URLs are internet-accessible unless protected; no confidential customer, personal, or production data belongs in this prototype. If review must be private, configure Cloudflare Access protection for the preview hostname before sharing it; otherwise make explicit that anyone with the preview URL can view it. Do not connect a custom production domain in the preview-only step.
7. After a successful preview build, verify the actual preview URL, mobile/desktop pages, noindex, draft status, static assets and absence of form submission/storage. Capture URL, deployment ID, commit SHA, artifact checksum, build log and screenshots in the audit record. Test rollback path using the prior successful preview deployment before expanding scope.

## Backup and rollback
- Preserve G1/G2/G3 branches and approved SHAs. Before any future artifact release, save the exact CI artifact and checksum, deployment metadata, and screenshot set outside Cloudflare; do not rewrite or overwrite milestone branches.
- Pages rollback must target a previously successful deployment belonging to the *new independent site project*. Do not use the panel's deployment or its backup as the website rollback source. If the new project has no known-good deploy, stop rather than improvise a rollback.
- Static HTML/CSS has no Worker/KV dependency. Do not alter Worker `redirects`, KV, routes, bindings, variables/secrets, DNS, or production project during G5 preview.

## Official references reviewed
- Git integration and automatic deploy behavior: https://developers.cloudflare.com/pages/get-started/git-integration/
- Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/
- Preview deployments: https://developers.cloudflare.com/pages/configuration/preview-deployments/
- Astro build configuration: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Custom domains (defer until separately authorized): https://developers.cloudflare.com/pages/configuration/custom-domains/

## Decisions/inputs still needed
- Luis's final commercial spelling/branding and approval of logo master/visual identity.
- Final copy and any legal/organizational representations; no pilot copy should be treated as official.
- Official contact channels; no contact details should be inferred from prototype fields.
- Whether the preview can be publicly reachable by URL or must be Access-protected.
- Whether Direct Upload is accepted for initial preview or Luis explicitly chooses Git integration after weighing its push-triggered deployment behavior.
- Exact approved artifact SHA, new Pages project name, account/project target, and preview/production environment scope.

**G5 gate:** stop here. Before G5, obtain Luis's separate exact authorization naming (a) artifact and immutable SHA/checksum, (b) the new Cloudflare Pages project, and (c) the environment (preview only; production excluded unless separately specified). This G4 plan itself authorizes no Cloudflare writes, project setup, Git connection, merge, deployment, or production publication.
