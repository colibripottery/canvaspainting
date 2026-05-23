# Colibri Canvas Painting Classes

Public schedule site for canvas painting classes at Colibri Pottery Studio. Deploy to **canvas.colibripotterystudio.com** via Vercel.

Connects to the backend at `https://api.colibripottery.com`.

## Setup

```bash
npm install
```

## Develop

```bash
npm run dev
```

## Build

```bash
npm run build
```

Output is in `dist/`. Preview with `npm run preview`.

## Deploy (Vercel)

1. Connect this repo to Vercel (Vite preset).
2. Optional: set `VITE_API_BASE` if using a different API host per environment.
3. Add custom domain `canvas.colibripotterystudio.com` in Vercel project settings.
4. Point DNS CNAME `canvas` → Vercel.

SPA routing is configured in `vercel.json`.

## Routes

- `/` — Home, monthly calendar, and class list by day
- `/classes/:acuityClassId` — Class detail with painting gallery and Acuity booking link

## API

- `GET /api/web/canvas-classes` — schedule (uses `refresh=true` on load)
- `GET /api/web/canvas-classes/{id}` — class detail
- `GET /api/web/locations` — studio info for footer
- `GET /api/web/classes` + `GET /api/acuity/calendars` — build Acuity deep links for booking

Booking links open `colibripottery.as.me` with appointment type, calendar, and datetime pre-filled. Falls back to [colibripotterystudio.com/booking](https://www.colibripotterystudio.com/booking) when metadata cannot be resolved.

## Main site link

Navbar and footer link back to [colibripotterystudio.com](https://www.colibripotterystudio.com).
