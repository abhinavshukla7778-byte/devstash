'use client';

import { useEffect, useState } from 'react';
import { Code, Sparkles, Terminal, StickyNote, File, Image, Link, Star, Pin, Copy, Pencil, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { ItemDetailData } from '@/lib/db/items';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link,
};

interface ItemDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function DrawerSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16 ml-auto" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function ItemDrawer({ itemId, onClose }: ItemDrawerProps) {
  const [item, setItem] = useState<ItemDetailData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!itemId) {
      setItem(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setItem(null);

    fetch(`/api/items/${itemId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setItem(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [itemId]);

  const Icon = item ? (ICON_MAP[item.typeIcon] ?? Code) : Code;

  return (
    <Sheet open={!!itemId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        {loading && (
          <>
            <SheetHeader className="px-6 pt-6 pb-0">
              <SheetTitle>
                <Skeleton className="h-6 w-48" />
              </SheetTitle>
            </SheetHeader>
            <DrawerSkeleton />
          </>
        )}

        {!loading && item && (
          <>
            {/* Header */}
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
              <SheetTitle className="text-left text-base font-semibold leading-snug pr-8">
                {item.title}
              </SheetTitle>
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                <span
                  className="px-2 py-0.5 text-xs rounded-full font-medium"
                  style={{ backgroundColor: `${item.typeColor}20`, color: item.typeColor }}
                >
                  {item.typeName}
                </span>
                {item.language && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground font-medium">
                    {item.language}
                  </span>
                )}
              </div>
            </SheetHeader>

            {/* Action bar */}
            <div className="flex items-center gap-1 px-6 py-3 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 text-xs ${item.isFavorite ? 'text-yellow-500' : ''}`}
              >
                <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                Favorite
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <Pin className="w-3.5 h-3.5" />
                Pin
              </Button>
              {item.content && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => navigator.clipboard.writeText(item.content ?? '')}
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </Button>
              )}
              <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-destructive hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-5">
              {/* Description */}
              {item.description && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Description</p>
                  <p className="text-sm">{item.description}</p>
                </div>
              )}

              {/* Content */}
              {item.content && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Content</p>
                  <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                    {item.content}
                  </pre>
                </div>
              )}

              {/* URL */}
              {item.url && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">URL</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline break-all"
                  >
                    {item.url}
                  </a>
                </div>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Collections */}
              {item.collections.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Collections</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.collections.map((col) => (
                      <span
                        key={col.id}
                        className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-md"
                      >
                        {col.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Details</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Updated</span>
                    <span>{formatDate(item.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
