# bretos-web

Web oficial comercial e institucional de **Bretos Services**.

Repositorio privado. Fuente central de datos y validaciones (fase G1).

## Estado actual (G1)

- Fuente central de datos en `data/`
- Validador que rechaza estados desconocidos y campos requeridos ausentes
- Pruebas automatizadas

**No hay sitio desplegado.** No se ha configurado Cloudflare Pages. No se ha tocado el Worker `redirects` ni el KV.

## Estructura

```
data/
  catalogo.json      # Ofertas y estados comerciales (solo Luis cambia estados)
  empresa.json       # Datos institucionales (borrador)
  categorias.json    # Categorías de producto
  contenidos/        # Publicaciones educativas (Markdown) — vacío en G1
scripts/
  validate.mjs       # Validador de la fuente central
tests/
  validate.test.mjs  # Pruebas del validador
```

## Estados permitidos

`available` · `pilot` · `planned` · `paused` · `verification_required`

Cualquier otro valor hace fallar la validación.

## Cómo probar

```bash
node scripts/validate.mjs   # debe imprimir VALIDACIÓN OK y exit 0
node tests/validate.test.mjs # pruebas de casos válidos e inválidos
```

O con npm:

```bash
npm run validate
npm test
```

## Reglas de gobernanza

- Solo Luis puede cambiar estados comerciales, precios y textos oficiales.
- No se tocan Worker redirects, KV ni configuración Cloudflare desde este repositorio.
- Cualquier despliegue requiere puerta G5 explícita.

## Próximos pasos (pendientes de autorización)

- Decisión de framework (Astro recomendado vs HTML plano)
- Textos definitivos de Nosotros / Estado de la empresa
- Número oficial de WhatsApp para codificación
- Informe completo de Cloudflare (baseline)
- Puertas G2–G6 según el documento de alineación v1.1
