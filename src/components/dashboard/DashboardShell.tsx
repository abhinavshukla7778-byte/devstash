'use client';

import { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <TopBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
