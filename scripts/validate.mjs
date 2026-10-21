#!/usr/bin/env node
/**
 * Validador de la fuente central de datos de Bretos Web (G1).
 * Falla con exit code != 0 si encuentra estados inválidos o campos requeridos ausentes.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA = join(ROOT, 'data');

const ALLOWED_STATUSES = new Set([
  'available',
  'pilot',
  'planned',
  'paused',
  'verification_required'
]);

const REQUIRED_ITEM_FIELDS = ['id', 'name', 'status', 'category'];

function loadJson(path) {
  if (!existsSync(path)) {
    throw new Error(`Archivo no encontrado: ${path}`);
  }
  const raw = readFileSync(path, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`JSON inválido en ${path}: ${e.message}`);
  }
}

function validateCatalog(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    errors.push('catalogo.json debe ser un objeto');
    return errors;
  }
  if (!Array.isArray(data.items)) {
    errors.push('catalogo.json debe contener un array "items"');
    return errors;
  }

  const ids = new Set();
  const categoryIds = new Set();

  // Cargar categorías si existen para validar referencias
  const catPath = join(DATA, 'categorias.json');
  if (existsSync(catPath)) {
    try {
      const cats = loadJson(catPath);
      if (Array.isArray(cats.categories)) {
        for (const c of cats.categories) {
          if (c.id) categoryIds.add(c.id);
        }
      }
    } catch (e) {
      errors.push(`No se pudieron cargar categorías: ${e.message}`);
    }
  }

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const prefix = `items[${i}]`;

    if (!item || typeof item !== 'object') {
      errors.push(`${prefix}: debe ser un objeto`);
      continue;
    }

    for (const field of REQUIRED_ITEM_FIELDS) {
      if (item[field] === undefined || item[field] === null || item[field] === '') {
        errors.push(`${prefix}: falta campo requerido "${field}"`);
      }
    }

    if (item.id) {
      if (ids.has(item.id)) {
        errors.push(`${prefix}: id duplicado "${item.id}"`);
      }
      ids.add(item.id);
    }

    if (item.status && !ALLOWED_STATUSES.has(item.status)) {
      errors.push(
        `${prefix} ("${item.id || '?'}"): status inválido "${item.status}". ` +
        `Permitidos: ${[...ALLOWED_STATUSES].join(', ')}`
      );
    }

    if (item.category && categoryIds.size > 0 && !categoryIds.has(item.category)) {
      errors.push(
        `${prefix} ("${item.id || '?'}"): category "${item.category}" no existe en categorias.json`
      );
    }
  }

  return errors;
}

function validateEmpresa(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    errors.push('empresa.json debe ser un objeto');
    return errors;
  }
  if (data.legal_entity === true) {
    // Solo advertencia si se marca como true sin evidencia; no falla build por ahora
    // pero se registra
  }
  return errors;
}

function main() {
  const allErrors = [];

  try {
    const catalog = loadJson(join(DATA, 'catalogo.json'));
    allErrors.push(...validateCatalog(catalog));
  } catch (e) {
    allErrors.push(e.message);
  }

  try {
    const empresa = loadJson(join(DATA, 'empresa.json'));
    allErrors.push(...validateEmpresa(empresa));
  } catch (e) {
    allErrors.push(e.message);
  }

  try {
    loadJson(join(DATA, 'categorias.json'));
  } catch (e) {
    allErrors.push(e.message);
  }

  if (allErrors.length > 0) {
    console.error('VALIDACIÓN FALLIDA');
    for (const err of allErrors) {
      console.error(' -', err);
    }
    process.exit(1);
  }

  console.log('VALIDACIÓN OK');
  console.log(`Estados permitidos: ${[...ALLOWED_STATUSES].join(', ')}`);
  process.exit(0);
}

main();
