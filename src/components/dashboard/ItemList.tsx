import { Code, Sparkles, Terminal, StickyNote, File, Image, Link2, Star, Pin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Item {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: Date;
  itemTypeId: string;
}

interface ItemListProps {
  title: string;
  items: Item[];
}

interface TypeConfig {
  icon: LucideIcon;
  color: string;
}

const typeConfig: Record<string, TypeConfig> = {
  type_1: { icon: Code, color: '#3b82f6' },
  type_2: { icon: Sparkles, color: '#8b5cf6' },
  type_3: { icon: Terminal, color: '#f97316' },
  type_4: { icon: StickyNote, color: '#fde047' },
  type_5: { icon: File, color: '#6b7280' },
  type_6: { icon: Image, color: '#ec4899' },
  type_7: { icon: Link2, color: '#10b981' },
};

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
          const config = typeConfig[item.itemTypeId] ?? typeConfig['type_1'];
          const Icon = config.icon;
          return (
            <div
              key={item.id}
              className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3 hover:border-muted-foreground/30 cursor-pointer transition-colors"
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color: config.color }} />
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
