import { auth } from "@/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSystemItemTypes } from "@/lib/db/items";

export default async function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, itemTypes, sidebarCollections] = await Promise.all([
    auth(),
    getSystemItemTypes(),
    getSidebarCollections(),
  ]);

  return (
    <DashboardShell
      user={session?.user ?? null}
      itemTypes={itemTypes}
      sidebarCollections={sidebarCollections}
    >
      {children}
    </DashboardShell>
  );
}
