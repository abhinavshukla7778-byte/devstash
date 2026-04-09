'use client';

import Link from 'next/link';
import { useState } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
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

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  itemTypes: SidebarItemType[];
  sidebarCollections: SidebarCollection[];
}

export default function Sidebar({ open, onToggle, onClose, itemTypes, sidebarCollections }: SidebarProps) {
  const [typesExpanded, setTypesExpanded] = useState(true);
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);

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
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: col.dominantColor }}
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

      {/* User avatar — expanded */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
            DS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">DevStash</p>
            <p className="text-xs text-muted-foreground truncate">demo@devstash.io</p>
          </div>
        </div>
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
      <div className="mt-auto border-t border-border w-full pt-3 flex justify-center">
        <div
          title="DevStash"
          className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold cursor-pointer"
        >
          DS
        </div>
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
