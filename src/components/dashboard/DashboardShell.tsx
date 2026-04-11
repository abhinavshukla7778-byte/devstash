'use client';

import { useState, useEffect } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import GlobalSearch from './GlobalSearch';
import type { SidebarItemType } from '@/lib/db/items';
import type { SidebarCollection } from '@/lib/db/collections';
import type { SearchItem, SearchCollection } from '@/actions/search';

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface DashboardShellProps {
  children: React.ReactNode;
  user: SessionUser | null;
  itemTypes: SidebarItemType[];
  sidebarCollections: SidebarCollection[];
  searchItems: SearchItem[];
  searchCollections: SearchCollection[];
}

export default function DashboardShell({
  children,
  user,
  itemTypes,
  sidebarCollections,
  searchItems,
  searchCollections,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <TopBar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearchClick={() => setSearchOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
          onClose={() => setSidebarOpen(false)}
          user={user}
          itemTypes={itemTypes}
          sidebarCollections={sidebarCollections}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <GlobalSearch
        items={searchItems}
        collections={searchCollections}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </div>
  );
}
