import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCollectionWithItems, getItemsByCollection } from "@/lib/db/collections";
import { COLLECTIONS_PER_PAGE } from "@/lib/constants";
import ItemsGrid from "@/components/dashboard/ItemsGrid";
import CollectionActionsBar from "@/components/collections/CollectionActionsBar";
import Pagination from "@/components/ui/Pagination";
import { Star } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const [collection, items] = await Promise.all([
    getCollectionWithItems(id, session.user.id),
    getItemsByCollection(id, session.user.id, page, COLLECTIONS_PER_PAGE),
  ]);

  if (!collection) notFound();

  const totalPages = Math.ceil(collection.itemCount / COLLECTIONS_PER_PAGE);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{collection.name}</h1>
              {collection.isFavorite && (
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            {collection.description && (
              <p className="text-muted-foreground text-sm mt-1">{collection.description}</p>
            )}
            <p className="text-muted-foreground text-sm mt-1">
              {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <CollectionActionsBar
            id={collection.id}
            name={collection.name}
            description={collection.description}
            isFavorite={collection.isFavorite}
          />
        </div>
      </div>

      {collection.itemCount === 0 ? (
        <p className="text-muted-foreground text-sm">No items in this collection yet.</p>
      ) : (
        <>
          <ItemsGrid items={items} />
          <Pagination
            page={page}
            totalPages={totalPages}
            buildHref={(p) => `/collections/${id}?page=${p}`}
          />
        </>
      )}
    </div>
  );
}
