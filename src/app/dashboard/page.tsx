import StatsCards from '@/components/dashboard/StatsCards';
import CollectionsGrid from '@/components/dashboard/CollectionsGrid';
import ItemList from '@/components/dashboard/ItemList';
import { getRecentCollections, getDashboardStats } from '@/lib/db/collections';
import { getPinnedItems, getRecentItems } from '@/lib/db/items';

export default async function DashboardPage() {
  const [stats, collections, pinnedItems, recentItems] = await Promise.all([
    getDashboardStats(),
    getRecentCollections(6),
    getPinnedItems(),
    getRecentItems(10),
  ]);

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
