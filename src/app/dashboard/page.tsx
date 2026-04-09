export default function DashboardPage() {
  return (
    <>
      <aside className="w-64 border-r border-border shrink-0 overflow-y-auto p-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Sidebar</h2>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <h2 className="text-sm font-semibold text-muted-foreground">Main</h2>
      </main>
    </>
  );
}
