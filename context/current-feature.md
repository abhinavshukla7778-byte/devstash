# Current Feature: Auth UI - Sign In, Register & Sign Out

## Status

In Progress

## Goals

- Custom `/sign-in` page with email/password fields, GitHub OAuth button, and link to register
- Custom `/register` page with name, email, password, confirm password, form validation, and redirect to sign-in on success
- Replace sidebar bottom user section with real user avatar (GitHub image or initials fallback), user name, and dropdown with "Sign out" link
- Avatar click navigates to `/profile`

## Notes

- Avatar logic: use `image` from session if available (GitHub), otherwise generate initials from name (e.g., "Brad Traversy" → "BT")
- Create a reusable avatar component that handles both cases
- Form validation: passwords match, email format, error display inline
- Register form submits to existing `POST /api/auth/register`
- Sign-in page handles both Credentials and GitHub OAuth providers

## History

- 2026-04-08: Initial Next.js and Tailwind setup
- 2026-04-09: Completed Dashboard UI Phase 1 — ShadCN setup, dashboard route, top bar, layout scaffold
- 2026-04-09: Completed Dashboard UI Phase 2 — Collapsible sidebar with Navigation header, type links, favorite/recent collections, user avatar, mobile drawer
- 2026-04-09: Completed Dashboard UI Phase 3 — Stats cards, collections grid, pinned items, and 10 recent items in main content area
- 2026-04-09: Completed Database Setup — Prisma 7 + Neon PostgreSQL, full schema with NextAuth models, initial migration, system item types seeded
- 2026-04-09: Completed Seed Sample Data — demo user, 7 system item types, 5 collections with 18 items linked via CollectionItem join table
- 2026-04-09: Completed Dashboard Collections — real DB data for collections grid and stats cards, dominant type border color, type icons per card
- 2026-04-09: Completed Dashboard Items — real DB data for pinned and recent items, type-derived icon/border/badge per card, hides pinned section when empty
- 2026-04-09: Completed Stats & Sidebar — real DB item types with counts in sidebar, "View all collections" link, colored circle for recent collections, sidebar data fetched server-side
- 2026-04-09: Completed Add Pro Badge to Sidebar — PRO badge added to File and Image types in sidebar using ShadCN Badge component (secondary variant, subtle styling)
- 2026-04-10: Completed Auth Setup — NextAuth v5 GitHub OAuth with split config pattern, Prisma adapter, JWT sessions, proxy.ts route protection for /dashboard/*, and postinstall patch for next-auth beta.30 iss parameter bug
- 2026-04-10: Completed Auth Credentials — Email/password Credentials provider with bcrypt validation, POST /api/auth/register route for user registration
