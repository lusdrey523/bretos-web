# Breto’s Services — sitio web

Estado de coordinación del proyecto al 22 de octubre de 2026. Este README documenta el estado conocido de las fases; no constituye autorización de merge, publicación ni cambios de infraestructura.

## Estado por fases

| Fase | Estado | Rama / referencia |
|---|---|---|
| G0 — línea base | Parcial. La revisión del repositorio está verificada; la inspección actual de Pages, DNS, rutas y bindings de Cloudflare sigue pendiente. | Coordinación externa; evidencia Cloudflare pendiente |
| G1 — datos y validación | Aprobada y cerrada como hito técnico. | `g1-data-source` — `ae69d3faa367e2e52591d05c53f53bcf25329402` |
| G2 — diseño | Aprobada y cerrada como preview estática no productiva. | `g2-design-preview` — `05498d3cdd75d295c01834bf74fadbf5e0d80f27` |
| G3 — funcionalidad | Aprobada y cerrada como preview funcional no productiva. | Hito de código aprobado: `e82e012569af75d34b2319471a8377eb3ee907fe`; HEAD actual de la rama (commit documental posterior): `59ba9ed32c07bb6d3c8f9bde8d65ae4ec5f300f0` |
| G4 — planificación Pages | Pendiente de línea base Cloudflare completa y de un plan específico. | Sin rama ni entregable aprobado |
| G5 — publicación | Pendiente de autorización explícita para el artefacto, SHA, proyecto y entorno concretos. | No autorizada ni ejecutada |

## Ramas e integración

`main` permanece en el commit inicial y contiene únicamente este README. G1, G2 y G3 se conservan en ramas independientes; no están integradas en `main`. Al momento de esta verificación no había PR abierto para integrarlas. No mezclar, borrar ni reescribir las ramas como parte de este estado documental.

## Verificación automática

- G1 no tiene un workflow propio; sus validaciones se ejecutan también desde el workflow de G3.
- G2 y G3 tienen workflows de verificación en sus respectivas ramas. Ejecutan build estático de Astro y generan capturas; G3 además ejecuta validación de G1 y pruebas G1+G3.
- Las ejecuciones exitosas de CI verifican la preview del SHA probado. No son aprobación editorial, merge ni despliegue.
- Los workflows de G2/G3 no configuran un despliegue de Cloudflare Pages.

## Límites vigentes

- G1–G3 son previews; no hay despliegue público autorizado desde este repositorio.
- No cambiar Worker `redirects`, KV, bindings, DNS, Pages, variables ni secretos desde este repositorio.
- La inspección de G0 por API no permite verificar hoy Pages, zonas/DNS, rutas ni bindings efectivos. No inferirlos a partir de la configuración de GitHub.
- El nombre comercial definitivo, logo maestro, WhatsApp oficial y textos institucionales/comerciales finales siguen pendientes de confirmación. El contenido de preview no debe presentarse como copy oficial.
- Solo Luis puede cambiar estados comerciales, precios y textos oficiales.
- El nombre de marca usado en este README es una referencia de proyecto; la forma comercial definitiva continúa pendiente de confirmación.

## Próxima puerta

Completar G0 con evidencia de lectura del panel Cloudflare, incluyendo Pages y su historial de despliegues, dominios/DNS y bindings efectivos del Worker. Después preparar y revisar el plan G4. Ningún resultado de esta revisión autoriza por sí solo cambios de configuración, merge o publicación.
