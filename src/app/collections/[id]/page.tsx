import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCollectionWithItems, getItemsByCollection } from "@/lib/db/collections";
import ItemsGrid from "@/components/dashboard/ItemsGrid";
import { Star } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const [collection, items] = await Promise.all([
    getCollectionWithItems(id, session.user.id),
    getItemsByCollection(id, session.user.id),
  ]);

  if (!collection) notFound();

  return (
    <div className="p-6">
      <div className="mb-6">
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

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No items in this collection yet.</p>
      ) : (
        <ItemsGrid items={items} />
      )}
    </div>
  );
}
