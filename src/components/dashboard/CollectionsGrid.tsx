import { Star, MoreHorizontal, Code, Sparkles, Terminal, StickyNote, File, Link2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { mockCollections } from '@/lib/mock-data';

interface TypeIcon {
  Icon: LucideIcon;
  color: string;
}

const collectionTypeIcons: Record<string, TypeIcon[]> = {
  coll_1: [{ Icon: Code, color: '#3b82f6' }, { Icon: Link2, color: '#10b981' }],
  coll_2: [{ Icon: Code, color: '#3b82f6' }, { Icon: File, color: '#6b7280' }],
  coll_3: [{ Icon: File, color: '#6b7280' }, { Icon: Link2, color: '#10b981' }, { Icon: StickyNote, color: '#fde047' }],
  coll_4: [{ Icon: Code, color: '#3b82f6' }, { Icon: StickyNote, color: '#fde047' }, { Icon: Link2, color: '#10b981' }],
  coll_5: [{ Icon: Terminal, color: '#f97316' }, { Icon: Code, color: '#3b82f6' }],
  coll_6: [{ Icon: Sparkles, color: '#8b5cf6' }, { Icon: Terminal, color: '#f97316' }, { Icon: Link2, color: '#10b981' }],
};

export default function CollectionsGrid() {
  const collections = [...mockCollections].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Collections</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View all
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => {
          const typeIcons = collectionTypeIcons[collection.id] ?? [{ Icon: Code, color: '#3b82f6' }];
          return (
            <div
              key={collection.id}
              className="bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/30 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium truncate">{collection.name}</span>
                  {collection.isFavorite && (
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
                  )}
                </div>
                <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground shrink-0 -mt-0.5 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {collection.itemCount} items
              </p>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                {collection.description}
              </p>
              <div className="flex items-center gap-2">
                {typeIcons.map(({ Icon, color }, i) => (
                  <Icon key={i} className="w-3.5 h-3.5" style={{ color }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
