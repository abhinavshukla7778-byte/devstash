import StatsCards from '@/components/dashboard/StatsCards';
import CollectionsGrid from '@/components/dashboard/CollectionsGrid';
import ItemList from '@/components/dashboard/ItemList';
import { mockItems } from '@/lib/mock-data';
import { getRecentCollections, getDashboardStats } from '@/lib/db/collections';

export default async function DashboardPage() {
  const [stats, collections] = await Promise.all([
    getDashboardStats(),
    getRecentCollections(6),
  ]);

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
        totalItems={stats.totalItems}
        totalCollections={stats.totalCollections}
        favoriteItems={stats.favoriteItems}
        favoriteCollections={stats.favoriteCollections}
      />

      <CollectionsGrid collections={collections} />

      <ItemList title="Pinned" items={pinnedItems} />

      <ItemList title="Recent Items" items={recentItems} />
    </div>
  );
}
