'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Code, Sparkles, Terminal, StickyNote, File, Image, Link2, FolderOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ItemDrawer from '@/components/dashboard/ItemDrawer';
import type { FavoriteItemData } from '@/lib/db/items';
import type { FavoriteCollectionData } from '@/lib/db/collections';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: Link2,
};

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface FavoritesListProps {
  items: FavoriteItemData[];
  collections: FavoriteCollectionData[];
}

export default function FavoritesList({ items, collections }: FavoritesListProps) {
  const router = useRouter();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const hasItems = items.length > 0;
  const hasCollections = collections.length > 0;
  const isEmpty = !hasItems && !hasCollections;

  if (isEmpty) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground text-sm font-mono">No favorites yet.</p>
        <p className="text-muted-foreground/60 text-xs font-mono mt-1">
          Star items or collections to see them here.
        </p>
      </div>
    );
  }

  return (
    <>
      {hasItems && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-1 pb-2 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
              Items
            </span>
            <span className="text-xs text-muted-foreground/60">({items.length})</span>
          </div>
          <ul>
            {items.map((item) => {
              const Icon = ICON_MAP[item.typeIcon] ?? Code;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setSelectedItemId(item.id)}
                    className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-accent/50 transition-colors border-b border-border/40 group"
                  >
                    <Icon
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: item.typeColor }}
                    />
                    <span className="flex-1 truncate text-sm font-mono text-foreground group-hover:text-foreground">
                      {item.title}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded shrink-0 font-mono"
                      style={{ backgroundColor: `${item.typeColor}20`, color: item.typeColor }}
                    >
                      {item.typeName}
                    </span>
                    <span className="text-[11px] text-muted-foreground/60 shrink-0 font-mono w-24 text-right">
                      {formatDate(item.updatedAt)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {hasCollections && (
        <section>
          <div className="flex items-center gap-2 mb-1 pb-2 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
              Collections
            </span>
            <span className="text-xs text-muted-foreground/60">({collections.length})</span>
          </div>
          <ul>
            {collections.map((col) => (
              <li key={col.id}>
                <button
                  onClick={() => router.push(`/collections/${col.id}`)}
                  className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-accent/50 transition-colors border-b border-border/40 group"
                >
                  <FolderOpen className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate text-sm font-mono text-foreground group-hover:text-foreground">
                    {col.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0 font-mono bg-accent text-muted-foreground">
                    {col.itemCount} {col.itemCount === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-[11px] text-muted-foreground/60 shrink-0 font-mono w-24 text-right">
                    {formatDate(col.updatedAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ItemDrawer
        itemId={selectedItemId}
        onClose={() => {
          setSelectedItemId(null);
          router.refresh();
        }}
      />
    </>
  );
}
