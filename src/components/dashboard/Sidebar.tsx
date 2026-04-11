'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link2,
  ChevronDown,
  ChevronRight,
  Star,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import UserAvatar from '@/components/ui/UserAvatar';
import type { SidebarItemType } from '@/lib/db/items';
import type { SidebarCollection } from '@/lib/db/collections';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: Link2,
};

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  user: SessionUser | null;
  itemTypes: SidebarItemType[];
  sidebarCollections: SidebarCollection[];
}

function UserDropdown({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute bottom-full left-2 right-2 mb-1 bg-popover border border-border rounded-md shadow-lg z-20 py-1">
        <Link
          href="/profile"
          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
          onClick={onClose}
        >
          <User className="w-4 h-4" />
          Profile
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/sign-in' })}
          className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ open, onToggle, onClose, user, itemTypes, sidebarCollections }: SidebarProps) {
  const [typesExpanded, setTypesExpanded] = useState(true);
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const favoriteCollections = sidebarCollections.filter((c) => c.isFavorite);
  const recentCollections = sidebarCollections.filter((c) => !c.isFavorite).slice(0, 3);

  // ── Expanded content ────────────────────────────────────────────────────────
  const expandedContent = (
    <div className="flex flex-col h-full">
      {/* Navigation header */}
      <div className="px-3 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground tracking-wide">
            Navigation
          </span>
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Types */}
        <button
          onClick={() => setTypesExpanded(!typesExpanded)}
          className="flex items-center gap-1 w-full text-xs font-semibold text-muted-foreground hover:text-foreground mb-1 transition-colors"
        >
          {typesExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
          Types
        </button>
        {typesExpanded && (
          <ul className="space-y-0.5">
            {itemTypes.map((type) => {
              const Icon = iconMap[type.icon] ?? Code;
              return (
                <li key={type.id}>
                  <Link
                    href={`/items/${type.name}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Icon className="w-4 h-4 shrink-0" style={{ color: type.color }} />
                    <span className="capitalize flex-1">{type.name}s</span>
                    {(type.name === 'file' || type.name === 'image') && (
                      <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 leading-none">PRO</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{type.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-border mx-3 my-1" />

      {/* Collections section */}
      <div className="px-3 py-2 flex-1 overflow-y-auto">
        <button
          onClick={() => setCollectionsExpanded(!collectionsExpanded)}
          className="flex items-center gap-1 w-full text-xs font-semibold text-muted-foreground hover:text-foreground mb-1 transition-colors"
        >
          {collectionsExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
          Collections
        </button>

        {collectionsExpanded && (
          <>
            {favoriteCollections.length > 0 && (
              <div className="mb-3">
                <p className="px-2 text-xs font-semibold text-muted-foreground mb-1 tracking-wide">
                  FAVORITES
                </p>
                <ul className="space-y-0.5">
                  {favoriteCollections.map((col) => (
                    <li key={col.id}>
                      <Link
                        href={`/collections/${col.id}`}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <span className="flex-1 truncate">{col.name}</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recentCollections.length > 0 && (
              <div>
                <p className="px-2 text-xs font-semibold text-muted-foreground mb-1 tracking-wide">
                  RECENT
                </p>
                <ul className="space-y-0.5">
                  {recentCollections.map((col) => (
                    <li key={col.id}>
                      <Link
                        href={`/collections/${col.id}`}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 bg-muted-foreground/30"
                          style={col.dominantColor ? { backgroundColor: col.dominantColor } : undefined}
                        />
                        <span className="flex-1 truncate">{col.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href="/collections"
              className="block mt-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all collections →
            </Link>
          </>
        )}
      </div>

      {/* User section — expanded */}
      <div className="border-t border-border p-3 relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent cursor-pointer transition-colors w-full text-left"
        >
          <UserAvatar name={user?.name} image={user?.image} className="w-7 h-7 text-xs shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name ?? 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</p>
          </div>
        </button>
        {dropdownOpen && (
          <UserDropdown onClose={() => setDropdownOpen(false)} />
        )}
      </div>
    </div>
  );

  // ── Collapsed (icon-only) content — desktop only ─────────────────────────
  const collapsedContent = (
    <div className="flex flex-col h-full items-center py-4 gap-1">
      {/* Expand button */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors mb-1"
        aria-label="Expand sidebar"
      >
        <PanelLeftOpen className="w-4 h-4" />
      </button>

      {/* Type icons */}
      {itemTypes.map((type) => {
        const Icon = iconMap[type.icon] ?? Code;
        return (
          <Link
            key={type.id}
            href={`/items/${type.name}`}
            title={`${type.name}s`}
            className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Icon className="w-4 h-4 shrink-0" style={{ color: type.color }} />
          </Link>
        );
      })}

      {/* User avatar — collapsed */}
      <div className="mt-auto border-t border-border w-full pt-3 flex justify-center relative">
        <button
          title={user?.name ?? 'User'}
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="cursor-pointer"
        >
          <UserAvatar name={user?.name} image={user?.image} className="w-7 h-7 text-xs" />
        </button>
        {dropdownOpen && (
          <UserDropdown onClose={() => setDropdownOpen(false)} />
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-hidden',
          'transition-all duration-200',
          // Mobile: fixed overlay drawer, controlled by translate
          'fixed inset-y-0 left-0 z-50 w-56',
          open ? 'translate-x-0' : '-translate-x-full',
          // Desktop: inline, expanded (w-56) or collapsed (w-[52px])
          'md:relative md:inset-auto md:z-auto md:translate-x-0',
          open ? 'md:w-56' : 'md:w-[52px]',
        )}
      >
        {/* Desktop */}
        <div className="hidden md:flex flex-col h-full overflow-y-auto">
          {open ? expandedContent : collapsedContent}
        </div>
        {/* Mobile: always full expanded content */}
        <div className="flex md:hidden flex-col h-full overflow-y-auto">
          {expandedContent}
        </div>
      </aside>
    </>
  );
}
