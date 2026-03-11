# Fere POS Web — Claude Code Instructions

## Project Overview
Point-of-Sale web application built with Next.js 16 (App Router), TypeScript, Zustand, and Tailwind CSS 4.

## Architecture
This project uses **Clean Architecture** with feature-first organization. See `.claude/skills/clean-architecture.md` for the complete architecture guide and enforcement rules.

## Quick Reference

### Directory Structure
```
src/
├── app/              # Routes & layouts (Route Groups: auth, customer, dashboard)
├── features/         # Feature modules (types, services, components, mock-data)
├── components/       # Shared components (ui/, layout/, providers/)
├── lib/              # Infrastructure (api/, constants/, utils/)
├── stores/           # Zustand global stores
├── hooks/            # Custom React hooks
└── types/            # Global type definitions
```

### Key Commands
```bash
npm run dev           # Start development server
npm run build         # Production build
npm run lint          # Run ESLint
```

### Tech Stack
- Next.js 16 + React 19 + TypeScript 5
- Zustand (state management)
- React Hook Form + Zod (forms & validation)
- Axios (HTTP client)
- Tailwind CSS 4 + Radix UI + Lucide icons
- Recharts (charts) + ExcelJS (export)

### Conventions
- Use `@/*` path alias for all imports
- File names: kebab-case (e.g., `product-table.tsx`)
- Components: PascalCase (e.g., `ProductTable`)
- Services: `featureService` object pattern
- Stores: `use[Feature]Store` hook pattern
- Always use barrel exports (`index.ts`)
- Language: UI in Indonesian, code in English
