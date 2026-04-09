import { Code, Sparkles, Terminal, StickyNote, File, Image, Link, Star, Pin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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

interface ItemListProps {
  title: string;
  items: ItemCardData[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ItemList({ title, items }: ItemListProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = ICON_MAP[item.typeIcon] ?? Code;
          return (
            <div
              key={item.id}
              className="bg-card border rounded-lg px-4 py-3 flex items-center gap-3 hover:opacity-90 cursor-pointer transition-opacity"
              style={{ borderColor: item.typeColor + '55' }}
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${item.typeColor}20` }}
              >
                <Icon className="w-4 h-4" style={{ color: item.typeColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="font-medium text-sm">{item.title}</span>
                  {item.isFavorite && (
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 shrink-0" />
                  )}
                  {item.isPinned && (
                    <Pin className="w-3 h-3 text-blue-400 shrink-0" />
                  )}
                  <span
                    className="px-1.5 py-0.5 text-xs rounded-sm shrink-0"
                    style={{ backgroundColor: `${item.typeColor}20`, color: item.typeColor }}
                  >
                    {item.typeName}
                  </span>
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-accent text-accent-foreground text-xs rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0 ml-2">
                {formatDate(item.createdAt)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
