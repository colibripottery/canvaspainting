export const STUDIO_TIMEZONE = 'America/Los_Angeles';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: STUDIO_TIMEZONE,
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: STUDIO_TIMEZONE,
  hour: 'numeric',
  minute: '2-digit',
});

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: STUDIO_TIMEZONE,
  month: 'long',
  year: 'numeric',
});

export function formatClassDate(isoString) {
  if (!isoString) return '';
  return dateFormatter.format(new Date(isoString));
}

export function formatClassTime(isoString) {
  if (!isoString) return '';
  return timeFormatter.format(new Date(isoString));
}

export function formatClassDateTime(isoString) {
  if (!isoString) return '';
  return `${formatClassDate(isoString)} at ${formatClassTime(isoString)}`;
}

export function formatMonthYear(year, month) {
  return monthYearFormatter.format(new Date(year, month, 1));
}

export function toDateKey(isoString) {
  if (!isoString) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: STUDIO_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(isoString));
  const y = parts.find((p) => p.type === 'year')?.value;
  const m = parts.find((p) => p.type === 'month')?.value;
  const d = parts.find((p) => p.type === 'day')?.value;
  return `${y}-${m}-${d}`;
}

export function getMonthBounds(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const minDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const maxDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(last.getDate()).padStart(2, '0')}`;
  return { minDate, maxDate, first, last };
}

function datePartsKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function getCalendarDays(year, month) {
  const { first, last } = getMonthBounds(year, month);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  const cells = [];

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevLast = new Date(prevYear, prevMonth + 1, 0).getDate();

  for (let i = startPad - 1; i >= 0; i -= 1) {
    const day = prevLast - i;
    cells.push({
      year: prevYear,
      month: prevMonth,
      day,
      inMonth: false,
      dateKey: datePartsKey(prevYear, prevMonth, day),
    });
  }

  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({
      year,
      month,
      day: d,
      inMonth: true,
      dateKey: datePartsKey(year, month, d),
    });
  }

  const remaining = 42 - cells.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let d = 1; d <= remaining; d += 1) {
    cells.push({
      year: nextYear,
      month: nextMonth,
      day: d,
      inMonth: false,
      dateKey: datePartsKey(nextYear, nextMonth, d),
    });
  }

  return cells;
}

export function groupClassesByDate(classes) {
  const map = new Map();
  for (const cls of classes) {
    const key = toDateKey(cls.class_datetime);
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(cls);
  }
  for (const [, list] of map) {
    list.sort((a, b) => new Date(a.class_datetime) - new Date(b.class_datetime));
  }
  return map;
}
