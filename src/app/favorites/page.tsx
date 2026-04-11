import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFavoriteItems } from "@/lib/db/items";
import { getFavoriteCollections } from "@/lib/db/collections";
import FavoritesList from "@/components/favorites/FavoritesList";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const [items, collections] = await Promise.all([
    getFavoriteItems(session.user.id),
    getFavoriteCollections(session.user.id),
  ]);

  const totalCount = items.length + collections.length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Favorites</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {totalCount} {totalCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      <FavoritesList items={items} collections={collections} />
    </div>
  );
}
