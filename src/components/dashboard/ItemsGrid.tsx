'use client';

import { useState } from 'react';
import { Code, Sparkles, Terminal, StickyNote, File, Image, Link, Star, Pin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ItemDrawer from '@/components/dashboard/ItemDrawer';
import type { ItemCardData } from '@/lib/db/items';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link,
};

interface ItemsGridProps {
  items: ItemCardData[];
  typeColor?: string;
}

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ItemsGrid({ items, typeColor }: ItemsGridProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = ICON_MAP[item.typeIcon] ?? Code;
          const color = typeColor ?? item.typeColor;
          return (
            <div
              key={item.id}
              className="bg-card border border-border rounded-lg px-4 py-3 flex items-start gap-3 hover:opacity-90 cursor-pointer transition-opacity border-l-4"
              style={{ borderLeftColor: color }}
              onClick={() => setSelectedItemId(item.id)}
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 self-start mt-0.5"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <span className="font-medium text-sm">{item.title}</span>
                  {item.isFavorite && (
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 shrink-0" />
                  )}
                  {item.isPinned && (
                    <Pin className="w-3 h-3 text-blue-400 shrink-0" />
                  )}
                  {item.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-accent text-accent-foreground text-xs rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {(item.description ?? item.content) && (
                  <p className="text-xs text-muted-foreground line-clamp-2 font-mono">
                    {item.description ?? item.content}
                  </p>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0 ml-2 self-start mt-0.5">
                {formatDate(item.createdAt)}
              </span>
            </div>
          );
        })}
      </div>

      <ItemDrawer itemId={selectedItemId} onClose={() => setSelectedItemId(null)} />
    </>
  );
}
