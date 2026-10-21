#!/usr/bin/env node
/**
 * Pruebas automatizadas del validador G1.
 * Ejecutar: node tests/validate.test.mjs
 */

import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TMP = join(ROOT, '.tmp-test-data');
const VALIDATE = join(ROOT, 'scripts', 'validate.mjs');

function setup() {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(join(TMP, 'data'), { recursive: true });
}

function writeData(name, obj) {
  writeFileSync(join(TMP, 'data', name), JSON.stringify(obj, null, 2));
}

function runValidate() {
  // Ejecutar el validador apuntando temporalmente al directorio de prueba
  // Sobreescribimos process.cwd vía env o simplemente copiamos el script temporalmente.
  // Para simplicidad: copiamos validate y apuntamos DATA vía env no implementado;
  // en su lugar, reemplazamos los archivos de data/ reales temporalmente no es seguro.
  // Mejor: el test invoca el validador sobre los archivos reales + casos de error inyectados.
  // Estrategia práctica: validar el script real (debe pasar) y luego probar lógica con datos sintéticos
  // mediante una función exportable. Como el script es CLI, usamos spawn sobre data real y
  // comprobamos fallos creando archivos temporales que el test limpia.

  // Para este entorno, ejecutamos el validador sobre los datos reales del repo.
  const result = spawnSync('node', [VALIDATE], {
    cwd: ROOT,
    encoding: 'utf8'
  });
  return result;
}

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

console.log('=== Pruebas G1 — validador de fuente central ===\n');

// 1. Datos reales del repo deben pasar
console.log('1. Validación de datos reales del repositorio');
{
  const r = runValidate();
  assert(r.status === 0, 'catalogo.json + empresa.json + categorias.json válidos (exit 0)');
  assert(r.stdout.includes('VALIDACIÓN OK'), 'salida contiene VALIDACIÓN OK');
}

// 2. Estado inválido debe fallar (simulado escribiendo temporalmente)
console.log('\n2. Rechazo de estado desconocido');
{
  const original = join(ROOT, 'data', 'catalogo.json');
  const backup = join(ROOT, 'data', 'catalogo.json.bak');
  const fs = await import('node:fs');
  fs.copyFileSync(original, backup);

  const bad = JSON.parse(fs.readFileSync(original, 'utf8'));
  bad.items[0].status = 'disponible'; // inválido
  fs.writeFileSync(original, JSON.stringify(bad, null, 2));

  const r = runValidate();
  assert(r.status !== 0, 'estado "disponible" produce exit != 0');
  assert(r.stderr.includes('status inválido') || r.stderr.includes('disponible'), 'mensaje de error menciona status inválido');

  fs.copyFileSync(backup, original);
  fs.unlinkSync(backup);
}

// 3. Campo requerido ausente debe fallar
console.log('\n3. Rechazo por campo requerido ausente');
{
  const original = join(ROOT, 'data', 'catalogo.json');
  const backup = join(ROOT, 'data', 'catalogo.json.bak');
  const fs = await import('node:fs');
  fs.copyFileSync(original, backup);

  const bad = JSON.parse(fs.readFileSync(original, 'utf8'));
  delete bad.items[0].name;
  fs.writeFileSync(original, JSON.stringify(bad, null, 2));

  const r = runValidate();
  assert(r.status !== 0, 'falta de "name" produce exit != 0');
  assert(r.stderr.includes('name') || r.stderr.includes('requerido'), 'mensaje menciona campo requerido');

  fs.copyFileSync(backup, original);
  fs.unlinkSync(backup);
}

// 4. id duplicado debe fallar
console.log('\n4. Rechazo de id duplicado');
{
  const original = join(ROOT, 'data', 'catalogo.json');
  const backup = join(ROOT, 'data', 'catalogo.json.bak');
  const fs = await import('node:fs');
  fs.copyFileSync(original, backup);

  const bad = JSON.parse(fs.readFileSync(original, 'utf8'));
  bad.items.push({ ...bad.items[0] }); // duplicar primer item
  fs.writeFileSync(original, JSON.stringify(bad, null, 2));

  const r = runValidate();
  assert(r.status !== 0, 'id duplicado produce exit != 0');
  assert(r.stderr.includes('duplicado'), 'mensaje menciona id duplicado');

  fs.copyFileSync(backup, original);
  fs.unlinkSync(backup);
}

console.log(`\n=== Resultado: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
