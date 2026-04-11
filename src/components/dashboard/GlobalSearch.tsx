'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Code, Sparkles, Terminal, StickyNote, File, Image, Link, FolderOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import ItemDrawer from '@/components/dashboard/ItemDrawer';
import type { SearchItem, SearchCollection } from '@/actions/search';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link,
};

function ItemTypeIcon({ icon, color }: { icon: string; color: string }) {
  const Icon = ICON_MAP[icon] ?? Code;
  return <Icon className="w-4 h-4 shrink-0" style={{ color }} />;
}

interface GlobalSearchProps {
  items: SearchItem[];
  collections: SearchCollection[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GlobalSearch({ items, collections, open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const handleSelectItem = useCallback((itemId: string) => {
    onOpenChange(false);
    setSelectedItemId(itemId);
  }, [onOpenChange]);

  const handleSelectCollection = useCallback((collectionId: string) => {
    onOpenChange(false);
    router.push(`/collections/${collectionId}`);
  }, [onOpenChange, router]);

  // Client-side fuzzy filter
  const q = query.toLowerCase().trim();
  const filteredItems = q
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.typeName.toLowerCase().includes(q) ||
          (item.preview?.toLowerCase().includes(q) ?? false)
      )
    : items.slice(0, 8);

  const filteredCollections = q
    ? collections.filter((col) => col.name.toLowerCase().includes(q))
    : collections.slice(0, 4);

  const hasResults = filteredItems.length > 0 || filteredCollections.length > 0;

  return (
    <>
      <CommandDialog open={open} onOpenChange={onOpenChange} title="Search items and collections">
        <CommandInput
          placeholder="Search items and collections..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!hasResults && <CommandEmpty>No results found.</CommandEmpty>}

          {filteredItems.length > 0 && (
            <CommandGroup heading="Items">
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`item-${item.id}-${item.title}`}
                  onSelect={() => handleSelectItem(item.id)}
                  className="gap-2"
                >
                  <ItemTypeIcon icon={item.typeIcon} color={item.typeColor} />
                  <span className="flex-1 truncate">{item.title}</span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: `${item.typeColor}20`, color: item.typeColor }}
                  >
                    {item.typeName}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredItems.length > 0 && filteredCollections.length > 0 && (
            <CommandSeparator />
          )}

          {filteredCollections.length > 0 && (
            <CommandGroup heading="Collections">
              {filteredCollections.map((col) => (
                <CommandItem
                  key={col.id}
                  value={`collection-${col.id}-${col.name}`}
                  onSelect={() => handleSelectCollection(col.id)}
                  className="gap-2"
                >
                  <FolderOpen className="w-4 h-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate">{col.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {col.itemCount} {col.itemCount === 1 ? 'item' : 'items'}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>

      <ItemDrawer
        itemId={selectedItemId}
        onClose={() => setSelectedItemId(null)}
      />
    </>
  );
}
