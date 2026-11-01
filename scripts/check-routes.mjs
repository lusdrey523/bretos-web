#!/usr/bin/env node
/**
 * Guard de regresión del sitio construido.
 * Se ejecuta después de `astro build` y falla si:
 *  - falta una ruta esperada o su título/H1 no coincide;
 *  - la navegación principal no está en el HTML (debe funcionar sin JavaScript);
 *  - una página referencia recursos externos (el sitio no debe pedir nada a terceros);
 *  - una ficha de línea no muestra su estado.
 * No comprueba estilos: eso se revisa en el navegador.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

/** [ruta, fragmento esperado en <title>, H1 exacto] */
const expected = [
  ['catalogo', 'Catálogo', 'Catálogo de servicios'],
  ['nosotros', 'Proyecto', 'El proyecto y su estado actual'],
  ['contacto', 'Contacto', 'Contacto'],
  ['', 'Bretos Services', 'Cuatro formas de conectar un negocio. Ninguna presentada como resuelta.'],
  ['como-trabajamos', 'Cómo trabajamos', 'Cómo se plantea trabajar'],
  ['bai', 'BAI', 'BAI, el asistente de Bretos Services'],
  ['ruta', 'Ruta y avances', 'Avanzar por etapas, con evidencia y sin adelantarse'],
  ['contenidos', 'Centro de contenidos', 'Centro de contenidos'],
  ['privacidad', 'Privacidad', 'Privacidad'],
  ['cookies', 'Cookies', 'Cookies'],
  ['terminos', 'Términos', 'Términos de uso']
];

const lineIds = [
  'tarjetas-nfc-qr-resenas-google',
  'tarjetas-nfc-qr-contacto-digital',
  'paginas-web-inteligentes',
  'agentes-de-ia'
];

const primaryHrefs = ['/', '/catalogo', '/bai', '/como-trabajamos', '/nosotros', '/contacto'];
const externalAllowed = ['https://wa.me/56936512828'];

let failed = false;
let failedCount = 0;

function fail(message) {
  console.error(`FAIL ${message}`);
  failed = true;
  failedCount++;
}

function read(route) {
  const path = join(DIST, route, 'index.html');
  if (!existsSync(path)) {
    fail(`${path}: no existe (¿se ejecutó el build?)`);
    return null;
  }
  return { path, html: readFileSync(path, 'utf8') };
}

function textOf(html, tag) {
  const match = html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return match ? match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';
}

for (const [route, titleFragment, h1] of expected) {
  const file = read(route);
  if (!file) continue;
  const failuresBefore = failedCount;
  const title = textOf(file.html, 'title');
  const actualH1 = textOf(file.html, 'h1');

  if (!title.includes(titleFragment)) fail(`${file.path}: título "${title}" no contiene "${titleFragment}"`);
  if (actualH1 !== h1) fail(`${file.path}: H1 "${actualH1}" distinto de "${h1}"`);

  // Navegación presente en el HTML: el menú móvil es <details>, no depende de JS.
  if (!file.html.includes('id="nav-mobile"')) fail(`${file.path}: falta el menú móvil sin JavaScript`);
  for (const href of primaryHrefs) {
    if (!file.html.includes(`href="${href}"`)) fail(`${file.path}: falta enlace de navegación ${href}`);
  }

  // Sin recursos de terceros: todo https:// debe ser un enlace permitido (no src/href de recurso).
  const urls = [...file.html.matchAll(/https?:\/\/[^\s"'<>]+/g)].map((m) => m[0]);
  for (const url of urls) {
    const allowed = externalAllowed.some((prefix) => url.startsWith(prefix));
    if (!allowed) fail(`${file.path}: referencia externa no permitida ${url}`);
  }

  if (failedCount === failuresBefore) console.log(`PASS /${route ? route + '/' : ''}: "${title}"; H1 "${actualH1}"`);
}

for (const id of lineIds) {
  const file = read(`catalogo/${id}`);
  if (!file) continue;
  if (!file.html.includes('badge--')) fail(`${file.path}: no muestra el estado de la línea`);
  if (!file.html.includes('+56 9 3651 2828')) fail(`${file.path}: no incluye el WhatsApp oficial`);
  console.log(`PASS /catalogo/${id}/: ficha con estado y contacto`);
}

if (existsSync(join(DIST, '404.html'))) {
  console.log('PASS /404.html: existe');
} else {
  fail('dist/404.html: no existe');
}

if (failed) process.exit(1);
console.log('\nRutas y HTML verificados.');
