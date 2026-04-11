import NextLink from 'next/link';
import CollectionCard from '@/components/dashboard/CollectionCard';
import type { CollectionCardData } from '@/lib/db/collections';

interface CollectionsGridProps {
  collections: CollectionCardData[];
  showHeader?: boolean;
}

export default function CollectionsGrid({ collections, showHeader = true }: CollectionsGridProps) {
  return (
    <section>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Collections</h2>
          <NextLink href="/collections" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all
          </NextLink>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}
