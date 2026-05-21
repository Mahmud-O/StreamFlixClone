# StreamFlixClone Instructions

This document explains how this project is structured and how to work in it consistently.

## Project overview

StreamFlixClone is a React + Vite streaming UI built around:

- Supabase authentication
- TMDB movie/TV data
- Protected and public routes
- My List management
- Tailwind CSS styling

## Core rules to follow

- Use React function components and hooks.
- Keep logic split into `Pages`, `Components`, `Contexts`, `CustomHooks`, and `services`.
- Use the existing `@/` path alias for imports from `src`.
- Prefer the current code style: single quotes, no semicolons, and small focused components.
- Keep API access centralized in service files instead of calling fetch directly inside random components.
- Protect authenticated pages with `ProtectedRoute` and keep auth pages public with `PublicRoute`.

## Repository structure

- `src/Pages` — route-level screens
- `src/Components` — shared UI, layout, route guards, and reusable widgets
- `src/Contexts` — global state providers
- `src/CustomHooks` — context hooks
- `src/services` — TMDB API helpers
- `src/assets` — images and icons
- `src/netlify/functions` — Netlify functions

## App flow

1. `main.jsx` wraps the app with `AuthProvider` and `MyListProvider`.
2. `router.jsx` defines public and protected routes.
3. `Layout.jsx` renders the shared navbar and footer.
4. `AuthProvider` manages Supabase session state.
5. `MyListProvider` loads and updates the user list from Supabase.

## Authentication pattern

- Session state comes from Supabase.
- `useAuth()` must only be used inside `AuthProvider`.
- `ProtectedRoute` redirects unauthenticated users.
- `PublicRoute` redirects signed-in users away from login/register pages.

## My List pattern

- `MyListProvider` owns list fetching, add, remove, and toggle behavior.
- TMDB details are fetched after list records are loaded from Supabase.
- Use `useMyList()` for list actions and state.

## TMDB pattern

- Keep all TMDB requests inside `src/services/tmdbService.js`.
- Read TMDB credentials from `src/config.js`.
- Add new TMDB endpoints as service functions first, then consume them in pages/components.

## Styling and UI

- Use Tailwind utility classes directly in components.
- Reuse shared UI from `src/Components/common` and `src/Components/ui`.
- Keep layout and interaction patterns consistent with the existing Netflix-style design.

## Environment variables

Required environment variables:

- `VITE_TMDB_API_KEY`
- `VITE_TMDB_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Common commands

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`

## Deployment notes

- Netlify builds with `pnpm build`
- The published directory is `dist`
- SPA routing is handled by a rewrite to `index.html`
- There is a scheduled Netlify function to keep Supabase alive

## When making changes

- Match existing file naming and folder placement.
- Keep route names and component responsibilities stable.
- Prefer small, surgical edits over broad rewrites.
- Update this document if the project workflow changes.
