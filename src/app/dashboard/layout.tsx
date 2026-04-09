import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
