import { auth } from "@/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSystemItemTypes } from "@/lib/db/items";
import { getSearchData } from "@/actions/search";

export default async function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, itemTypes, sidebarCollections, searchData] = await Promise.all([
    auth(),
    getSystemItemTypes(),
    getSidebarCollections(),
    getSearchData(),
  ]);

  return (
    <DashboardShell
      user={session?.user ?? null}
      itemTypes={itemTypes}
      sidebarCollections={sidebarCollections}
      searchItems={searchData.items}
      searchCollections={searchData.collections}
    >
      {children}
    </DashboardShell>
  );
}
