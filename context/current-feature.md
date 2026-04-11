# Current Feature: Implement Collection Create

## Status

In Progress

## Goals

- Add a "New Collection" button in the top bar (alongside the existing "New Item" button)
- Clicking the button opens a modal dialog with fields: name (required) and description (optional)
- Implement a `createCollection` server action in `src/actions/collections.ts` with Zod validation
- Add a `createCollection` DB function in `src/lib/db/collections.ts` (user-scoped)
- Show a sonner toast on success or failure
- Close the modal and refresh the page/list after successful creation
- Follow the same patterns as item create (Dialog, server action, Zod, toast, router.refresh)

## Notes

- Collections are user-scoped — always filter/create by authenticated user's ID
- Follow existing patterns: server components fetch via lib/db functions, client-side mutations via server actions
- The modal should use ShadCN Dialog component
- Validate inputs with Zod before hitting the DB
- Keep the create button consistent with the "New Item" button styling in the top bar

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
- 2026-04-10: Completed Auth UI — Custom /sign-in and /register pages, reusable UserAvatar component (GitHub image or initials), real user in sidebar with sign-out dropdown
- 2026-04-10: Completed Profile Page — /profile route with user info (avatar, name, email, member-since), usage stats (total items, collections, per-type breakdown), change password dialog (email users only), and delete account dialog with confirmation
- 2026-04-10: Completed Items List View — dynamic /items/[type] route, server component with Prisma fetch, responsive two-column grid of ItemCards filtered by type, type-colored left border
- 2026-04-10: Completed Item Drawer — shadcn Sheet drawer opens on item card click (dashboard + items list), fetches full detail via /api/items/[id] with auth check, skeleton loading state, action bar (Favorite/Pin/Copy/Edit/Delete), shows description, content, tags, collections, and created/updated dates
- 2026-04-10: Completed Item Drawer Edit Mode — inline edit mode in the drawer (same Sheet), controlled inputs for title/description/tags plus type-specific fields (content, language, URL), Zod-validated server action in src/actions/items.ts, updateItem DB query with tag disconnect+connect-or-create, sonner toast on save/error, router.refresh() after save
- 2026-04-10: Completed Delete Item — Trash2 button in item drawer opens ShadCN AlertDialog for confirmation, deleteItem server action with ownership check, sonner toast on success, drawer closes and list refreshes after deletion
- 2026-04-10: Completed Item Create — "New Item" button in top bar opens a Dialog with type selector (snippet, prompt, command, note, link), dynamic fields per type (content/language for snippet/command, content for prompt/note, URL for link), createItem server action with Zod validation, sonner toast on success, modal closes and list refreshes
