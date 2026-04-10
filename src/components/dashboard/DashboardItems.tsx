'use client';

import { useState } from 'react';
import ItemList from '@/components/dashboard/ItemList';
import ItemDrawer from '@/components/dashboard/ItemDrawer';
import type { ItemCardData } from '@/lib/db/items';

interface DashboardItemsProps {
  pinnedItems: ItemCardData[];
  recentItems: ItemCardData[];
}

export default function DashboardItems({ pinnedItems, recentItems }: DashboardItemsProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <>
      <ItemList title="Pinned" items={pinnedItems} onItemClick={setSelectedItemId} />
      <ItemList title="Recent Items" items={recentItems} onItemClick={setSelectedItemId} />
      <ItemDrawer itemId={selectedItemId} onClose={() => setSelectedItemId(null)} />
    </>
  );
}
