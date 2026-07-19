# Laundry Management — Frontend (React + TypeScript)

Customer- and staff-facing web app for a multi-outlet laundry service, consuming the [Go backend API](https://github.com/AzafaDev/laundry-app-golang). Covers the full customer journey (order, pay, track) and the full staff/admin operational pipeline (intake, wash/iron/pack stations, driver dispatch, attendance, reporting) behind role-based routing.

- Live demo: https://laundry-app-typescript-react.vercel.app
- Backend repo: https://github.com/AzafaDev/laundry-app-golang

## Tech stack

| | |
|---|---|
| Framework | React 19 + TypeScript, Vite |
| Routing | React Router v7 |
| Server state | TanStack Query |
| Forms & validation | React Hook Form + Zod |
| Styling | Tailwind CSS v4 |
| Maps | Leaflet / React-Leaflet (address picking, geocoding) |

## Role-based access

Routes are gated by dedicated guard components (`ProtectedRoute`, `StaffProtectedRoute`, `SuperAdminRoute`, `AdminRoute`, `OutletAdminRoute`, `WorkerRoute`, `DriverRoute`, `StaffOnlyRoute`, `GuestRoute`) rather than one generic auth check, so each role only sees the routes it's actually authorized for:

- **Customer** — register/login (incl. Google OAuth), profile, addresses, place orders, track orders, pay (Midtrans), view notifications.
- **Worker (washing/ironing/packing)** — station queue and history for their pipeline stage.
- **Driver** — pickup/delivery task list, active task, history.
- **Outlet admin** — order intake/processing, bypass requests, outlet-scoped orders and complaints.
- **Super admin** — outlets, employees, laundry items, clothing types, work shifts, attendance/sales/employee-performance reports.

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL to your backend
npm run dev
```

## Available scripts

- `npm run dev` — start dev server
- `npm run build` — type-check (`tsc -b`) + production build
- `npm run lint` — ESLint
- `npm run preview` — preview production build locally

## Deployment

Deployed on Vercel. `vercel.json` rewrites all paths to `index.html` so client-side routes (e.g. the OAuth callback) resolve correctly instead of 404ing on direct navigation.
