'use client';

import { Check, FolderOpen } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
}

interface CollectionSelectorProps {
  collections: Collection[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export default function CollectionSelector({
  collections,
  selected,
  onChange,
}: CollectionSelectorProps) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  if (collections.length === 0) {
    return (
      <p className="text-xs text-muted-foreground py-2">
        No collections yet. Create one first.
      </p>
    );
  }

  return (
    <div className="max-h-36 overflow-y-auto rounded-md border border-input bg-background">
      {collections.map((col) => {
        const isSelected = selected.includes(col.id);
        return (
          <button
            key={col.id}
            type="button"
            onClick={() => toggle(col.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors hover:bg-accent hover:text-accent-foreground ${
              isSelected ? 'bg-accent/50' : ''
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">{col.name}</span>
            {isSelected && (
              <Check className="w-3.5 h-3.5 shrink-0 text-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
