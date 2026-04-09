import StatsCards from '@/components/dashboard/StatsCards';
import CollectionsGrid from '@/components/dashboard/CollectionsGrid';
import ItemList from '@/components/dashboard/ItemList';
import { mockItems, mockCollections, mockItemTypeCounts } from '@/lib/mock-data';

export default function DashboardPage() {
  const totalItems = Object.values(mockItemTypeCounts).reduce((a, b) => a + b, 0);
  const totalCollections = mockCollections.length;
  const favoriteItems = mockItems.filter((i) => i.isFavorite).length;
  const favoriteCollections = mockCollections.filter((c) => c.isFavorite).length;

  const pinnedItems = mockItems.filter((i) => i.isPinned);
  const recentItems = [...mockItems]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your developer knowledge hub
        </p>
      </div>

      <StatsCards
        totalItems={totalItems}
        totalCollections={totalCollections}
        favoriteItems={favoriteItems}
        favoriteCollections={favoriteCollections}
      />

      <CollectionsGrid />

      <ItemList title="Pinned" items={pinnedItems} />

      <ItemList title="Recent Items" items={recentItems} />
    </div>
  );
}
