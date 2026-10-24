#!/usr/bin/env node
/** Regression guard for route-specific rendered page identity. Run after Astro build. */
import { readFileSync } from 'node:fs';
const expected = [
  ['catalogo', 'Catálogo', 'Catálogo de servicios'],
  ['nosotros', 'Nosotros', 'El proyecto y su estado actual'],
  ['contacto', 'Contacto', 'Contacto'],
];
let failed = false;
for (const [route, title, h1] of expected) {
  const path = `dist/${route}/index.html`;
  const html = readFileSync(path, 'utf8');
  const actualTitle = html.match(/<title>(.*?)<\/title>/i)?.[1] ?? '';
  const actualH1 = html.match(/<h1\b[^>]*>(.*?)<\/h1>/is)?.[1]?.replace(/<[^>]*>/g, '').trim() ?? '';
  if (!actualTitle.includes(title) || actualH1 !== h1) {
    console.error(`FAIL ${path}: expected title containing "${title}" and H1 "${h1}"; got title "${actualTitle}", H1 "${actualH1}"`);
    failed = true;
  } else console.log(`PASS /${route}/: title "${actualTitle}"; H1 "${actualH1}"`);
}
if (failed) process.exit(1);
