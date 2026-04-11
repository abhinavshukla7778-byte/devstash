import NextLink from 'next/link';
import { Star, MoreHorizontal, Code, Sparkles, Terminal, StickyNote, File, Image, Link } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CollectionCardData } from '@/lib/db/collections';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link,
};

interface CollectionsGridProps {
  collections: CollectionCardData[];
}

export default function CollectionsGrid({ collections }: CollectionsGridProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Collections</h2>
        <NextLink href="/collections" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View all
        </NextLink>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => {
          return (
            <NextLink
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="bg-card border rounded-lg p-4 hover:opacity-90 transition-opacity block"
              style={collection.dominantColor ? { borderColor: collection.dominantColor + '55' } : undefined}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium truncate">{collection.name}</span>
                  {collection.isFavorite && (
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
                  )}
                </div>
                <span className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground shrink-0 -mt-0.5 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
              </p>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                {collection.description}
              </p>
              <div className="flex items-center gap-2">
                {collection.typeIcons.map(({ icon, color }, i) => {
                  const TypeIcon = ICON_MAP[icon] ?? Code;
                  return <TypeIcon key={i} className="w-3.5 h-3.5" style={{ color }} />;
                })}
              </div>
            </NextLink>
          );
        })}
      </div>
    </section>
  );
}
