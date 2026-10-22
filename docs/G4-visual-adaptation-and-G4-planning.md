# G4 — visual adaptation and deployment planning (planning only)

**Status:** preview branch / not production. Brand spelling, logo master status, and site copy remain unapproved. This document is not authorization to create or configure Cloudflare Pages.

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
- If/when G5 is separately authorized, create a separate Pages project named `bretos-web`; do not reuse or alter `panel-bretos-services`.
- No Worker, KV, Functions, runtime secrets, API token, or customer-data backend is required for this static preview. Keep `noindex` while preview/draft content remains.
- Start with the generated `*.pages.dev` hostname only. A custom domain decision, DNS change, and public production launch are not part of G4.

### Git/deployment route — decision still required

**Recommendation for future approval:** keep `main` protected and production build disabled until the production content/release checklist is approved; test Git integration first on a separate preview branch, with Preview deployments limited or protected. Only after a separately approved production-ready commit and controlled branch promotion should a production branch be configured. Do not connect Git while `main` contains only its initial README unless production builds are explicitly disabled/otherwise safely gated: Cloudflare Pages Git integration can build and deploy on pushes, so a connection can create deployments automatically.

Alternative: Direct Upload avoids an automatic Git-triggered build but requires a deliberate manual artifact build/upload/release process and reduces traceability; it is not the recommended route for ongoing development. No option has been configured or activated.

### Acceptance gates before any production launch

1. Luis resolves display-name spelling (`Bretos` / `Breto's`), logo/master asset, and copy approvals; keep legal/entity and pilot disclaimers accurate.
2. Independently approve product names, descriptions, availability/status and all claims. Do not infer pricing or commercial availability.
3. Confirm form/data-handling requirements and actual contact channel before enabling either; until then leave them inactive.
4. Run G1 validation, G3 tests, static Astro build, accessibility and responsive checks (desktop/mobile), and manual review of each route. Keep screenshot evidence tied to the exact commit.
5. Review preview visibility. Preview deployments may be publicly reachable unless access controls are configured; publish only content safe to disclose. Keep `noindex` for drafts, while recognizing it is not access control.
6. Review project/account access, branch/build settings and rollback route before the separately authorized G5 work.

### Rollback / reversibility (proposal)

For an eventual Pages project, retain the previous known-good deployment and use Pages deployment rollback to that immutable deployment; for Git-managed sources, revert the relevant commit through the normal reviewed branch process. If custom hostname/DNS is added later, document prior DNS values and separately approve its reversal. This plan itself changes no deployment, DNS, project or account configuration.

## Official Cloudflare documentation reviewed

- Git integration: https://developers.cloudflare.com/pages/get-started/git-integration/
- Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/
- Preview deployments: https://developers.cloudflare.com/pages/configuration/preview-deployments/
- Build configuration: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/

These sources describe Pages behavior; account-specific configuration remains unmodified.
