import { API_BASE } from './config';

/**
 * @param {Object} options
 * @param {string} options.minDate - YYYY-MM-DD
 * @param {string} options.maxDate - YYYY-MM-DD
 * @param {string} [options.location] - Campbell | NSJ
 * @param {boolean} [options.onlyWithPaintings=true]
 * @param {boolean} [options.refresh=true]
 */
export async function fetchCanvasClasses({
  minDate,
  maxDate,
  location,
  onlyWithPaintings = true,
  refresh = true,
}) {
  const params = new URLSearchParams({
    min_date: minDate,
    max_date: maxDate,
    only_with_paintings: String(onlyWithPaintings),
    refresh: String(refresh),
  });
  if (location) {
    params.set('location', location);
  }

  const res = await fetch(`${API_BASE}/api/web/canvas-classes?${params}`);
  if (!res.ok) {
    throw new Error(`Failed to load classes: ${res.status}`);
  }
  const data = await res.json();
  if (data?.message) {
    throw new Error(data.message);
  }
  return Array.isArray(data) ? data : [];
}

export async function fetchCanvasClassById(acuityClassId) {
  const res = await fetch(`${API_BASE}/api/web/canvas-classes/${acuityClassId}`);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to load class: ${res.status}`);
  }
  const data = await res.json();
  if (data?.message) {
    throw new Error(data.message);
  }
  return data;
}

export async function fetchLocations() {
  const res = await fetch(`${API_BASE}/api/web/locations`);
  if (!res.ok) {
    throw new Error(`Failed to load locations: ${res.status}`);
  }
  const data = await res.json();
  if (data?.message) {
    throw new Error(data.message);
  }
  return data;
}
