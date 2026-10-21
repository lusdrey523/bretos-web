# bretos-web

Web oficial comercial e institucional de **Bretos Services**.

Repositorio privado.

## Estado actual

| Fase | Estado | Rama / Commit |
|------|--------|---------------|
| G1 — Fuente de datos y validación | Completada | `g1-data-source` / `ae69d3fa…` |
| G2 — Diseño y contenido (preview) | En revisión | `g2-design-preview` |

## Cómo ver la preview G2 (local)

```bash
git checkout g2-design-preview
npm install
npm run dev
```

Abre la URL que indique Astro (normalmente `http://localhost:4321`).

**No hay despliegue público.** No configurar Cloudflare ni Pages desde este repositorio sin puerta G5.

## Estructura G2

- `src/pages/` — Inicio, Catálogo, Nosotros, Contenidos, Contacto
- `src/layouts/Layout.astro` — shell, header, menú móvil, footer
- `src/components/` — ProductCard, StatusBadge
- `src/styles/global.css` — mobile-first, acento `#18C7C8`
- `data/` — fuente central G1 (sin modificar en G2)

## Reglas

- Solo Luis cambia estados comerciales y textos oficiales.
- Textos de preview marcados como **BORRADOR**.
- WhatsApp y logo maestro: placeholders hasta confirmación.
- Worker redirects / KV / Cloudflare: no tocar.

## Validación de datos (G1)

```bash
npm run validate
npm test
```
