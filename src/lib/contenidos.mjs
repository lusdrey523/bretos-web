/**
 * Utilidades de búsqueda y filtrado para el centro de contenidos (G3).
 * Puras: sin I/O. Usadas por la UI y por tests con fixtures.
 */

/**
 * @typedef {Object} ContenidoItem
 * @property {string} id
 * @property {string} title
 * @property {string} [summary]
 * @property {string} category - id de categoría (p. ej. nfc-qr, servicios, ia)
 * @property {string} [body]
 * @property {string} [updated]
 */

/**
 * Normaliza texto para comparación (minúsculas, sin acentos extras simples).
 * @param {string} s
 * @returns {string}
 */
export function normalizeText(s) {
  if (s == null) return '';
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Filtra por categoría exacta (id). Si category es vacío/null/'all', no filtra.
 * @param {ContenidoItem[]} items
 * @param {string|null|undefined} categoryId
 * @returns {ContenidoItem[]}
 */
export function filterByCategory(items, categoryId) {
  if (!Array.isArray(items)) return [];
  if (!categoryId || categoryId === 'all') return items.slice();
  return items.filter((item) => item && item.category === categoryId);
}

/**
 * Búsqueda por texto en title, summary y body.
 * @param {ContenidoItem[]} items
 * @param {string|null|undefined} query
 * @returns {ContenidoItem[]}
 */
export function searchByQuery(items, query) {
  if (!Array.isArray(items)) return [];
  const q = normalizeText(query);
  if (!q) return items.slice();
  return items.filter((item) => {
    if (!item) return false;
    const haystack = normalizeText(
      [item.title, item.summary, item.body].filter(Boolean).join(' ')
    );
    return haystack.includes(q);
  });
}

/**
 * Aplica categoría y luego búsqueda.
 * @param {ContenidoItem[]} items
 * @param {{ category?: string|null, query?: string|null }} opts
 * @returns {ContenidoItem[]}
 */
export function filterContenidos(items, opts = {}) {
  const byCat = filterByCategory(items, opts.category);
  return searchByQuery(byCat, opts.query);
}

/**
 * Lista de categorías presentes en los ítems (para UI de filtros).
 * @param {ContenidoItem[]} items
 * @param {{ id: string, name: string }[]} [knownCategories]
 * @returns {{ id: string, name: string, count: number }[]}
 */
export function categoriesWithCounts(items, knownCategories = []) {
  const counts = new Map();
  if (Array.isArray(items)) {
    for (const item of items) {
      if (!item?.category) continue;
      counts.set(item.category, (counts.get(item.category) || 0) + 1);
    }
  }
  const nameById = new Map(
    (knownCategories || []).map((c) => [c.id, c.name])
  );
  return [...counts.entries()].map(([id, count]) => ({
    id,
    name: nameById.get(id) || id,
    count
  }));
}
