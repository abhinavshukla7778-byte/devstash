import { notFound } from 'next/navigation';
import { getItemsByType } from '@/lib/db/items';
import ItemsGrid from '@/components/dashboard/ItemsGrid';

interface PageProps {
  params: Promise<{ type: string }>;
}

export default async function ItemsTypePage({ params }: PageProps) {
  const { type } = await params;
  const result = await getItemsByType(type);

  if (!result) notFound();

  const { items, typeColor, typeName } = result;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold capitalize">{typeName}s</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No {typeName}s yet.</p>
      ) : (
        <ItemsGrid items={items} typeColor={typeColor} />
      )}
    </div>
  );
}
