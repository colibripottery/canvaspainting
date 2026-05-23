import { BOOKING_FALLBACK_URL } from '../data/locations';
import { fetchClassCatalog, fetchCalendars, isCanvasClassName } from '../api/bookingMeta';

const ACUITY_SCHEDULE_BASE = 'https://colibripottery.as.me/schedule/b81c3c74/';

function normalizeName(value) {
  return (value || '').trim().toLowerCase();
}

function findAppointmentTypeId(className, catalog) {
  const target = normalizeName(className);
  const exact = catalog.find((item) => normalizeName(item.name) === target);
  if (exact?.id) return exact.id;

  const canvasTypes = catalog.filter((item) => isCanvasClassName(item.name));
  if (canvasTypes.length === 1) return canvasTypes[0].id;

  const partial = canvasTypes.find((item) => {
    const name = normalizeName(item.name);
    return target.includes(name) || name.includes(target);
  });
  return partial?.id ?? canvasTypes[0]?.id ?? null;
}

function findCalendarId(calendarName, calendars) {
  const target = normalizeName(calendarName);
  const exact = calendars.find((cal) => normalizeName(cal.name) === target);
  if (exact?.id) return exact.id;

  if (target.includes('campbell')) {
    return calendars.find((cal) => normalizeName(cal.name).includes('campbell'))?.id ?? null;
  }
  if (target.includes('nsj') || target.includes('north san jose')) {
    return calendars.find((cal) => normalizeName(cal.name).includes('nsj'))?.id ?? null;
  }
  return null;
}

function formatAcuityDatetime(isoString) {
  if (!isoString) return null;
  return isoString.replace(/\.\d{3}/, '');
}

/**
 * Build Acuity deep link for a canvas class session.
 * @param {Object} canvasClass
 * @param {Object} [meta] - preloaded { catalog, calendars }
 */
export async function buildBookingUrl(canvasClass, meta) {
  try {
    const [catalog, calendars] = meta
      ? [meta.catalog, meta.calendars]
      : await Promise.all([fetchClassCatalog(), fetchCalendars()]);

    const appointmentTypeId = findAppointmentTypeId(canvasClass.class_name, catalog);
    const calendarId = findCalendarId(canvasClass.calendar_name, calendars);
    const datetime = formatAcuityDatetime(canvasClass.class_datetime);

    if (!appointmentTypeId || !datetime) {
      return BOOKING_FALLBACK_URL;
    }

    const params = new URLSearchParams({
      appointmentType: String(appointmentTypeId),
      datetime,
      embed: 'true',
      showFooter: 'false',
      showHeader: 'false',
      showTitle: 'false',
      showTimezone: 'true',
    });

    if (calendarId) {
      params.set('calendarID', String(calendarId));
    }

    return `${ACUITY_SCHEDULE_BASE}?${params.toString()}`;
  } catch {
    return BOOKING_FALLBACK_URL;
  }
}

export async function preloadBookingMeta() {
  const [catalog, calendars] = await Promise.all([
    fetchClassCatalog(),
    fetchCalendars(),
  ]);
  return { catalog, calendars };
}
