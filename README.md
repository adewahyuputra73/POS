# Kodeka POS

Modern Point of Sale (POS) web application built with **React 19**, **Vite**, **React Router v7**, **TypeScript**, and **Tailwind CSS 4**.

## Tech Stack

- **Framework:** React 19 + Vite 6
- **Routing:** React Router v7
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand 5
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **UI Primitives:** Radix UI
- **Icons:** Lucide React
- **Charts:** Recharts
- **Maps:** Leaflet

## Getting Started

### Requirements

- Node.js 18+ (recommended: 20+)
- npm / yarn / pnpm

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

Production build is output to `dist/`.

### Preview Production Build

```bash
npm run preview
```

### Other Scripts

```bash
npm run type-check   # TypeScript type-check
npm run lint         # ESLint
npm run format       # Prettier
```

## Environment Variables

Copy `.env.example` to `.env.local` and adjust the values:

```bash
cp .env.example .env.local
```

Available variables:

- `VITE_API_URL` — Base URL for the backend API.

## Project Structure

```
src/
├── app/              # Root app shell, providers, global styles
├── components/       # Shared/reusable UI components
├── features/         # Feature modules (auth, products, inventory, reports, etc.)
├── lib/              # API client, utilities, constants
├── pages/            # Route page components
├── routes/           # Route definitions (React Router)
├── stores/           # Zustand stores
├── App.tsx           # Root component with router
└── main.tsx          # Vite entry point
```

## Backend

The frontend talks to a separate Golang backend service. There is no backend logic in this repository — all API calls go through `src/lib/api/` clients.

## License

Private — Kodeka Labs.
