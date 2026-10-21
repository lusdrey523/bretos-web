#!/usr/bin/env node
/**
 * Pruebas G3 — búsqueda y filtros del centro de contenidos.
 * Usa fixtures locales; no inventa publicaciones en data/.
 */

import {
  normalizeText,
  filterByCategory,
  searchByQuery,
  filterContenidos,
  categoriesWithCounts
} from '../src/lib/contenidos.mjs';

const fixtures = [
  {
    id: 'f1',
    title: 'Guía NFC básica',
    summary: 'Introducción a tarjetas NFC',
    category: 'nfc-qr',
    body: 'NFC y QR para negocios en Chile'
  },
  {
    id: 'f2',
    title: 'Menú digital en restaurantes',
    summary: 'Casos de uso de QR en gastronomía',
    category: 'nfc-qr',
    body: 'Cómo presentar el menú sin papel'
  },
  {
    id: 'f3',
    title: 'Asistente de atención',
    summary: 'IA para mensajes',
    category: 'ia',
    body: 'Automatizar respuestas frecuentes'
  },
  {
    id: 'f4',
    title: 'Sitio web simple',
    summary: 'Diseño y desarrollo',
    category: 'servicios',
    body: 'Landing y catálogo estático'
  }
];

const knownCats = [
  { id: 'nfc-qr', name: 'Tarjetas NFC/QR' },
  { id: 'servicios', name: 'Servicios' },
  { id: 'ia', name: 'Asistentes de IA' }
];

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

console.log('=== Pruebas G3 — contenidos (fixtures) ===\n');

console.log('1. normalizeText');
assert(normalizeText('ÁÉÍÓÚ') === 'aeiou', 'quita acentos');
assert(normalizeText('  Hola  ') === 'hola', 'trim + lower');

console.log('\n2. filterByCategory');
{
  const nfc = filterByCategory(fixtures, 'nfc-qr');
  assert(nfc.length === 2, 'nfc-qr → 2 ítems');
  assert(filterByCategory(fixtures, 'ia').length === 1, 'ia → 1 ítem');
  assert(filterByCategory(fixtures, 'all').length === 4, 'all → todos');
  assert(filterByCategory(fixtures, null).length === 4, 'null → todos');
  assert(filterByCategory([], 'nfc-qr').length === 0, 'lista vacía');
}

console.log('\n3. searchByQuery');
{
  assert(searchByQuery(fixtures, 'nfc').length === 1, 'query nfc → guía NFC');
  assert(searchByQuery(fixtures, 'menú').length === 1, 'query menú (acentos)');
  assert(searchByQuery(fixtures, 'chile').length === 1, 'busca en body');
  assert(searchByQuery(fixtures, '').length === 4, 'query vacío → todos');
  assert(searchByQuery(fixtures, 'xyz-no-existe').length === 0, 'sin resultados');
}

console.log('\n4. filterContenidos combinado');
{
  const r = filterContenidos(fixtures, { category: 'nfc-qr', query: 'menú' });
  assert(r.length === 1 && r[0].id === 'f2', 'nfc-qr + menú → f2');
  const empty = filterContenidos([], { category: 'ia', query: 'x' });
  assert(empty.length === 0, 'sin publicaciones → vacío');
}

console.log('\n5. categoriesWithCounts');
{
  const counts = categoriesWithCounts(fixtures, knownCats);
  const nfc = counts.find((c) => c.id === 'nfc-qr');
  assert(nfc && nfc.count === 2 && nfc.name === 'Tarjetas NFC/QR', 'conteo nfc-qr');
  assert(categoriesWithCounts([]).length === 0, 'sin ítems → sin categorías');
}

console.log(`\n=== Resultado: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
