import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllCollections } from "@/lib/db/collections";
import CollectionsGrid from "@/components/dashboard/CollectionsGrid";

export default async function CollectionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const collections = await getAllCollections(session.user.id);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {collections.length} {collections.length === 1 ? "collection" : "collections"}
        </p>
      </div>

      {collections.length === 0 ? (
        <p className="text-muted-foreground text-sm">No collections yet.</p>
      ) : (
        <CollectionsGrid collections={collections} />
      )}
    </div>
  );
}
