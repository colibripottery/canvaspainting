import { API_BASE } from './config';

const CACHE_TTL_MS = 5 * 60 * 1000;

let classCatalogCache = { data: null, updatedAt: 0, promise: null };
let calendarsCache = { data: null, updatedAt: 0, promise: null };

function isFresh(entry) {
  return entry.updatedAt > 0 && Date.now() - entry.updatedAt < CACHE_TTL_MS;
}

async function fetchWithCache(entry, fetcher) {
  if (entry.data && isFresh(entry)) return entry.data;
  if (entry.promise) return entry.promise;

  entry.promise = fetcher()
    .then((data) => {
      entry.data = data;
      entry.updatedAt = Date.now();
      return data;
    })
    .finally(() => {
      entry.promise = null;
    });

  return entry.promise;
}

export async function fetchClassCatalog() {
  return fetchWithCache(classCatalogCache, async () => {
    const res = await fetch(`${API_BASE}/api/web/classes`);
    if (!res.ok) throw new Error(`Failed to load class catalog: ${res.status}`);
    const data = await res.json();
    if (data?.message) throw new Error(data.message);
    return Array.isArray(data) ? data : [];
  });
}

export async function fetchCalendars() {
  return fetchWithCache(calendarsCache, async () => {
    const res = await fetch(`${API_BASE}/api/acuity/calendars`);
    if (!res.ok) throw new Error(`Failed to load calendars: ${res.status}`);
    const data = await res.json();
    if (data?.message) throw new Error(data.message);
    return Array.isArray(data) ? data : [];
  });
}

export function isCanvasClassName(name) {
  const lower = (name || '').toLowerCase();
  return lower.includes('canvas') || lower.includes('stroke');
}
