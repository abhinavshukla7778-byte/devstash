# Current Feature: Collection Actions

## Status

In Progress

## Goals

- Add Edit, Delete, and Favorite action buttons to the `/collections/[id]` page header
- Favorite button is UI-only (no functionality yet, just the icon/button)
- Edit button opens a modal to edit collection name and description
- Delete button opens a confirmation dialog; on confirm, removes items from the collection (via CollectionItem join table) but does NOT delete the items themselves, then deletes the collection
- On collection cards at `/collections` and dashboard, replace any existing card click behavior: clicking anywhere on the card navigates to `/collections/[id]`, but a 3-dots (MoreHorizontal) menu icon shows a dropdown with Edit, Delete, and Favorite options
- Favorite option in the dropdown is UI-only for now

## Notes

- Items are linked via CollectionItem join table — removing from collection means deleting CollectionItem records, not Item records
- Edit modal fields: name (required), description (optional) — same as collection create
- Delete confirmation should warn that items will be unlinked but not deleted
- The 3-dots dropdown must stop event propagation so it doesn't trigger the card navigation click

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
- 2026-04-11: Completed Collection Create — "New Collection" button in top bar opens a Dialog with name (required) and description (optional) fields, createCollection server action with Zod validation and user-scoped DB function, sonner toast on success/error, modal closes and page refreshes; empty collections show no color border or type icons on card/sidebar
- 2026-04-11: Completed Add Item to Collections — multi-select CollectionSelector component added to New Item dialog and Item Drawer edit mode; fetches user-scoped collections via getUserCollections server action; wires assignments through createItem and updateItem server actions into CollectionItem join table using deleteMany + createMany sync on update
- 2026-04-11: Completed Collections Pages — /collections page lists all user collections; /collections/[id] shows items in a specific collection with mixed-type per-item colors; collection cards on dashboard and /collections link to their /collections/[id] page; "View all" button and sidebar link both point to /collections
