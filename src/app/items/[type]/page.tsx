import { notFound } from 'next/navigation';
import { getItemsByType } from '@/lib/db/items';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import ItemsGrid from '@/components/dashboard/ItemsGrid';
import Pagination from '@/components/ui/Pagination';

interface PageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function ItemsTypePage({ params, searchParams }: PageProps) {
  const { type } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const result = await getItemsByType(type, page, ITEMS_PER_PAGE);

  if (!result) notFound();

  const { items, typeColor, typeName, totalCount } = result;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold capitalize">{typeName}s</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      {totalCount === 0 ? (
        <p className="text-muted-foreground text-sm">No {typeName}s yet.</p>
      ) : (
        <>
          <ItemsGrid items={items} typeColor={typeColor} />
          <Pagination
            page={page}
            totalPages={totalPages}
            buildHref={(p) => `/items/${type}?page=${p}`}
          />
        </>
      )}
    </div>
  );
}
