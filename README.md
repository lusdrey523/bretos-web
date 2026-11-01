# Bretos Services — sitio web

Sitio multipágina del proyecto **Bretos Services**, en etapa piloto. No existe entidad legal
constituida, no hay stock confirmado, no se publican precios y no hay venta en línea.

Este repositorio es la fuente de datos y de contenido del sitio. Nada de lo que contiene autoriza
por sí solo un despliegue, un merge ni un cambio de infraestructura.

## Rutas

| Ruta | Contenido |
|---|---|
| `/` | Portada: las cuatro líneas, principios y estado real de BAI |
| `/catalogo` | Índice de las cuatro líneas con su estado y disponibilidad |
| `/catalogo/[linea]` | Ficha por línea: qué contempla, qué no incluye, precio y disponibilidad |
| `/como-trabajamos` | Método de trabajo propuesto, con sus límites explícitos |
| `/nosotros` | Estado del proyecto: etapa, ausencia de entidad legal y transparencia |
| `/ruta` | Hoja de ruta por etapas: definido, en curso y pendiente |
| `/contenidos` | Centro de contenidos previsto, sin publicaciones aún |
| `/bai` | Interfaz de BAI preparada y **desactivada** |
| `/contacto` | Canal único: WhatsApp oficial, sin formulario |
| `/privacidad`, `/cookies`, `/terminos` | Borradores sin revisión legal, con datos pendientes señalados |
| `/404` | Página de error |

## Las cuatro líneas

1. **Tarjetas NFC/QR para reseñas auténticas en Google** — en etapa piloto.
2. **Tarjetas NFC/QR de contacto digital** — en etapa piloto.
3. **Páginas web inteligentes** — línea prevista, alcance por confirmar.
4. **Agentes de IA para atención** — línea prevista, alcance por confirmar.

Las líneas 1 y 2 conservan la descripción verificada al 24-10-2026. Las líneas 3 y 4 se incorporaron
como intención de negocio: no son capacidades operativas probadas. Ninguna ficha promete reseñas,
posiciones, plazos ni cifras.

## BAI

BAI es el asistente previsto del sitio. Su estado vive en `data/bai.json` y hoy es `inactive`:
no hay proveedor de IA, ni clave, ni llamada externa. La página `/bai` muestra la interfaz con los
campos desactivados y explica qué falta para activarla. `scripts/validate.mjs` impide marcar BAI
como activo sin proveedor declarado.

## Datos

- `data/empresa.json` — identidad y estado del proyecto (draft).
- `data/catalogo.json` — las cuatro líneas, con `provenance`, alcance y límites.
- `data/bai.json` — estado, reglas previstas y decisiones abiertas de BAI.
- `data/categorias.json` — categorías usadas por el catálogo.
- `data/contenidos/` — reservado para publicaciones futuras; hoy vacío.

## Comandos

```bash
npm install       # instalar dependencias
npm run dev       # servidor local
npm run validate  # valida los datos
npm test          # pruebas de validación, contenidos y líneas
npm run build     # build estático en dist/
npm run check:routes  # verifica rutas, títulos, H1, navegación y ausencia de terceros
npm run verify    # validate + test + build + check:routes
```

## Decisiones de diseño

- **Sin recursos de terceros.** No se cargan tipografías, scripts ni imágenes externas; la CSP de
  `public/_headers` lo refleja (`connect-src 'self'`). El único enlace externo es WhatsApp, y solo se
  abre si la persona lo pulsa.
- **Sin JavaScript obligatorio.** La navegación y el contenido funcionan sin JS; el menú móvil usa
  `<details>` y el script solo añade comodidad.
- **Sin formularios ni analítica.** No se recopila, envía ni mide nada de quien visita el sitio.
- **Estados visibles.** Cada línea muestra si está en piloto o prevista, y cada cifra ausente se
  declara como no confirmada.

## Límites vigentes

- No hay despliegue público autorizado desde este repositorio.
- No cambiar DNS, Pages, Worker, bindings, variables ni secretos desde aquí.
- Los textos legales son borradores sin revisión profesional.
- La forma comercial definitiva del nombre y el logo maestro siguen pendientes de confirmación; este
  sitio usa «Bretos Services» de forma consistente.
