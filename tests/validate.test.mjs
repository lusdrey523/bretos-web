#!/usr/bin/env node
/**
 * Pruebas automatizadas del validador G1.
 * Ejecutar: node tests/validate.test.mjs
 *
 * Las pruebas de rechazo (estados inválidos, campos faltantes, ids duplicados)
 * se ejecutan sobre un directorio temporal con fixtures. Nunca modifican
 * data/catalogo.json del repositorio.
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  copyFileSync,
  existsSync,
  createHash
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash as cryptoHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const VALIDATE = join(ROOT, 'scripts', 'validate.mjs');
const CATALOGO = join(ROOT, 'data', 'catalogo.json');
const EMPRESA = join(ROOT, 'data', 'empresa.json');
const CATEGORIAS = join(ROOT, 'data', 'categorias.json');
const TMP_ROOT = join(ROOT, '.tmp-g1-tests');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log('  PASS:', message);
    passed++;
  } else {
    console.error('  FAIL:', message);
    failed++;
  }
}

function fileHash(path) {
  if (!existsSync(path)) return null;
  const content = readFileSync(path);
  return cryptoHash('sha256').update(content).digest('hex');
}

function runValidateOn(cwd) {
  const script = join(cwd, 'scripts', 'validate.mjs');
  return spawnSync('node', [script], {
    cwd,
    encoding: 'utf8'
  });
}

function runValidateReal() {
  return spawnSync('node', [VALIDATE], {
    cwd: ROOT,
    encoding: 'utf8'
  });
}

/**
 * Crea un árbol temporal con el validador y fixtures de datos.
 * catalogOverride permite inyectar un catalogo.json modificado.
 */
function createTempTree(catalogOverride = null) {
  const tmp = join(TMP_ROOT, `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  mkdirSync(join(tmp, 'scripts'), { recursive: true });
  mkdirSync(join(tmp, 'data'), { recursive: true });

  copyFileSync(VALIDATE, join(tmp, 'scripts', 'validate.mjs'));
  copyFileSync(EMPRESA, join(tmp, 'data', 'empresa.json'));
  copyFileSync(CATEGORIAS, join(tmp, 'data', 'categorias.json'));

  if (catalogOverride) {
    writeFileSync(join(tmp, 'data', 'catalogo.json'), JSON.stringify(catalogOverride, null, 2));
  } else {
    copyFileSync(CATALOGO, join(tmp, 'data', 'catalogo.json'));
  }

  return tmp;
}

function cleanupTemp() {
  if (existsSync(TMP_ROOT)) {
    rmSync(TMP_ROOT, { recursive: true, force: true });
  }
}

console.log('=== Pruebas G1 — validador de fuente central ===\n');

// Capturar hash original del catálogo para verificar que no se altera
const originalCatalogHash = fileHash(CATALOGO);

try {
  // 1. Datos reales del repo deben pasar
  console.log('1. Validación de datos reales del repositorio');
  {
    const r = runValidateReal();
    assert(r.status === 0, 'catalogo.json + empresa.json + categorias.json válidos (exit 0)');
    assert(
      (r.stdout || '').includes('VALIDACIÓN OK'),
      'salida contiene VALIDACIÓN OK'
    );
  }

  // 2. Estado inválido debe fallar (fixture temporal)
  console.log('\n2. Rechazo de estado desconocido');
  {
    let tmp;
    try {
      const base = JSON.parse(readFileSync(CATALOGO, 'utf8'));
      base.items[0].status = 'disponible'; // inválido
      tmp = createTempTree(base);
      const r = runValidateOn(tmp);
      assert(r.status !== 0, 'estado "disponible" produce exit != 0');
      assert(
        (r.stderr || '').includes('status inválido') || (r.stderr || '').includes('disponible'),
        'mensaje de error menciona status inválido'
      );
    } finally {
      if (tmp && existsSync(tmp)) rmSync(tmp, { recursive: true, force: true });
    }
  }

  // 3. Campo requerido ausente debe fallar (fixture temporal)
  console.log('\n3. Rechazo por campo requerido ausente');
  {
    let tmp;
    try {
      const base = JSON.parse(readFileSync(CATALOGO, 'utf8'));
      delete base.items[0].name;
      tmp = createTempTree(base);
      const r = runValidateOn(tmp);
      assert(r.status !== 0, 'falta de "name" produce exit != 0');
      assert(
        (r.stderr || '').includes('name') || (r.stderr || '').includes('requerido'),
        'mensaje menciona campo requerido'
      );
    } finally {
      if (tmp && existsSync(tmp)) rmSync(tmp, { recursive: true, force: true });
    }
  }

  // 4. id duplicado debe fallar (fixture temporal)
  console.log('\n4. Rechazo de id duplicado');
  {
    let tmp;
    try {
      const base = JSON.parse(readFileSync(CATALOGO, 'utf8'));
      base.items.push({ ...base.items[0] }); // duplicar primer item
      tmp = createTempTree(base);
      const r = runValidateOn(tmp);
      assert(r.status !== 0, 'id duplicado produce exit != 0');
      assert(
        (r.stderr || '').includes('duplicado'),
        'mensaje menciona id duplicado'
      );
    } finally {
      if (tmp && existsSync(tmp)) rmSync(tmp, { recursive: true, force: true });
    }
  }

  // Verificación final: el catálogo real no debe haber cambiado
  console.log('\n5. Integridad de datos originales');
  {
    const afterHash = fileHash(CATALOGO);
    assert(
      originalCatalogHash === afterHash,
      'data/catalogo.json no fue modificado por las pruebas'
    );
  }
} finally {
  cleanupTemp();
}

console.log(`\n=== Resultado: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
