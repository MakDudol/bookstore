export function pickRandom(books, excludeIds = []) {
  if (!Array.isArray(books) || books.length === 0) return null;

  const exclude = new Set(excludeIds);
  const pool = books.filter((b) => b && b.id && !exclude.has(b.id));

  if (pool.length === 0) return null;

  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

export function shuffle(list) {
  if (!Array.isArray(list)) return [];
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
