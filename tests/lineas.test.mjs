#!/usr/bin/env node
/**
 * Pruebas de contenido del sitio integral (cuatro líneas + BAI).
 * Leen los datos reales del repositorio y comprueban invariantes de honestidad:
 * sin precios, sin plazos, sin stock afirmado y sin BAI presentado como activo.
 * No modifican ningún archivo.
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const catalogo = JSON.parse(readFileSync(join(ROOT, 'data', 'catalogo.json'), 'utf8'));
const bai = JSON.parse(readFileSync(join(ROOT, 'data', 'bai.json'), 'utf8'));
const items = catalogo.items ?? [];

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    console.log('  PASS:', msg);
    passed++;
  } else {
    console.error('  FAIL:', msg);
    failed++;
  }
}

console.log('=== Pruebas de contenido — cuatro líneas y BAI ===\n');

console.log('1. Composición del catálogo');
{
  assert(items.length === 4, 'hay exactamente 4 líneas');
  const ids = items.map((i) => i.id);
  assert(new Set(ids).size === 4, 'los identificadores son únicos');
  assert(
    items.filter((i) => i.status === 'pilot').length === 2,
    'dos líneas siguen en etapa piloto'
  );
  assert(
    items.filter((i) => i.provenance === 'propuesto').length === 2,
    'dos líneas están marcadas como propuestas'
  );
  assert(
    items.every((i) => Array.isArray(i.scope) && i.scope.length > 0),
    'cada línea declara qué contempla'
  );
  assert(
    items.every((i) => Array.isArray(i.not_included) && i.not_included.length > 0),
    'cada línea declara qué no incluye'
  );
}

console.log('\n2. Ninguna cifra ni promesa inventada');
{
  const prohibidos = [
    /\bgarantizamos\b/i,
    /\bgarantizado\b/i,
    /\bstock disponible\b/i,
    /\bprecio\s*(final|desde)\b/i,
    /\b\d+\s*(d[ií]as?|semanas?|meses?)\b/i,
    /\bCLP\b/,
    /\$\s?\d/
  ];
  for (const item of items) {
    const texto = [
      item.description,
      item.availability,
      item.pricing,
      ...(item.scope ?? []),
      ...(item.not_included ?? [])
    ]
      .filter(Boolean)
      .join(' ');
    const encontrado = prohibidos.find((re) => re.test(texto));
    assert(!encontrado, `${item.id}: sin promesas ni cifras (${encontrado ?? 'ok'})`);
  }
  assert(
    items.every((i) => /confirmar|por confirmar/i.test(i.availability)),
    'la disponibilidad se declara por confirmar'
  );
  assert(
    items.every((i) => /no confirmad/i.test(i.pricing)),
    'el precio se declara no confirmado'
  );
}

console.log('\n3. Estado real de BAI');
{
  assert(bai.state === 'inactive', 'BAI figura como inactivo');
  assert(bai.provider === null, 'no hay proveedor de IA declarado');
  assert(
    /no responde/i.test(bai.plain_status),
    'el texto dice explícitamente que no responde'
  );
  assert(Array.isArray(bai.planned_rules) && bai.planned_rules.length > 0, 'declara reglas previstas');
  assert(Array.isArray(bai.open_decisions) && bai.open_decisions.length > 0, 'declara decisiones abiertas');
}

console.log(`\n=== Resultado: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
