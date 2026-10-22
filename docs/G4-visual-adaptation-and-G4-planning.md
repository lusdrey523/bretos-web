# G4 — visual adaptation and deployment planning (planning only)

**Status:** preview branch / not production. Brand spelling, logo master status, and site copy remain unapproved. This document records the authorized, isolated preview route; it does not authorize production launch or changes outside that route.

## Visual comparison and adaptation

| Area | Prototype `bretos.vercel.app` | G3 functional preview | G4 adaptation |
|---|---|---|---|
| Brand mark | Custom Bretos visual identity | Dashed turquoise square with placeholder “B” | Uses the exact logo image referenced by the pilot, with existing text kept screen-reader accessible; prototype-derived asset, not a verified master |
| Color | Black, white, light gray, teal `#18C7C8` | Primarily white/light gray, teal limited to CTA/status | Black hero panel and teal divider/CTA, retaining white/gray content surfaces and G3 status/disclaimer colors |
| Landing composition | Sales-oriented sections and product artwork | Centered text, product status cards, pilot disclaimer | Visual styling adjusted only; G3 sections and draft language remain in place |
| Product imagery / claims | Prototype includes a card concept graphic and commercial claims | No product photos; data/status-driven cards | No concept graphic imported: it embeds unverified QR/product details and claims. No associated copy or behavior imported |
| Contact / form | Prototype form is non-submitting and explicitly provisional | No active contact, disabled WhatsApp placeholder | Unchanged; no form, external channel, data collection or submission added |

**Source asset:** logo from the public pilot asset URL `https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20de%20Breto%27s%20Services%20color-PVrU0lQkCvnuZbm8bPMNfBNqPnxCLy.png`, copied to `public/images/bretos-logo-prototype.png`. It is a visual reference only. The pilot webpage and its wording are not treated as production approval. The prototype image of a Google-review card was intentionally excluded because visible commercial statements and example QR details are not validated.

## G4 planning proposal (no Cloudflare changes made)

### Target architecture

- Static Astro output; repository root `/`, build command `npm run build`, output directory `dist`; Astro configuration already sets `output: 'static'` and does not require an adapter.
- Create a separate Pages project named `bretos-web-preview`; do not reuse or alter `panel-bretos-services`. This project is preview-only and has no Git integration.
- No Worker, KV, Functions, runtime secrets, API token, or customer-data backend is required for this static preview. Keep `noindex` while preview/draft content remains.
- Start with the generated `*.pages.dev` hostname only. A custom domain decision, DNS change, and public production launch are not part of G4.

### Deployment route — Direct Upload, isolated preview only

Use Direct Upload of the reviewed static `dist/` from the exact successful CI artifact for branch `g4-visual-preview`. Create only the separate Pages project `bretos-web-preview`, with no Git repository connection, no custom domain, and no production release. The uploaded deployment must be explicitly marked as a preview deployment under a non-production branch name (for example `g4-visual-preview`); verify the API response reports preview, not production, before proceeding. If the API does not guarantee that distinction, stop before upload.

This choice avoids automatic builds or deployments from `main` or pushes. Preserve `main` and the G1/G2/G3/G4 branches; do not merge or open a PR. The preview hostname may be publicly reachable by anyone who knows the URL; `noindex` is not access control. Do not add Access or other unapproved dependencies. No secrets, Functions, Worker, KV, customer-data backend, custom domain, DNS, or production traffic are involved. Rollback/recovery is limited to selecting a known-good deployment in this new preview project; do not delete resources as rollback without separate approval.

### Acceptance gates before any production launch

1. Luis resolves display-name spelling (`Bretos` / `Breto's`), logo/master asset, and copy approvals; keep legal/entity and pilot disclaimers accurate.
2. Independently approve product names, descriptions, availability/status and all claims. Do not infer pricing or commercial availability.
3. Confirm form/data-handling requirements and actual contact channel before enabling either; until then leave them inactive.
4. Run G1 validation, G3 tests, static Astro build, accessibility and responsive checks (desktop/mobile), and manual review of each route. Keep screenshot evidence tied to the exact commit.
5. Review preview visibility. Preview deployments may be publicly reachable unless access controls are configured; publish only content safe to disclose. Keep `noindex` for drafts, while recognizing it is not access control.
6. Review project/account access, branch/build settings and rollback route before the separately authorized G5 work.

### Rollback / reversibility (proposal)

For `bretos-web-preview`, retain the deployment ID and immutable artifact/commit record. If the preview is defective, stop sharing it and use the project’s deployment rollback to a known-good deployment; do not delete the project or modify DNS. No Git-managed deployment or custom hostname is configured by this plan.

## Official Cloudflare documentation reviewed

- Git integration: https://developers.cloudflare.com/pages/get-started/git-integration/
- Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/
- Preview deployments: https://developers.cloudflare.com/pages/configuration/preview-deployments/
- Build configuration: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/

These sources describe Pages behavior; account-specific configuration remains unmodified.
