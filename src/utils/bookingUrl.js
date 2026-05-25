import { BOOKING_FALLBACK_URL } from '../data/locations';

export function getBookingUrl(canvasClass) {
  return canvasClass?.booking_url || BOOKING_FALLBACK_URL;
}
