import { Layers, FolderOpen, Star, Folder } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardsProps {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

interface StatCard {
  label: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

export default function StatsCards({
  totalItems,
  totalCollections,
  favoriteItems,
  favoriteCollections,
}: StatsCardsProps) {
  const stats: StatCard[] = [
    {
      label: 'Total Items',
      value: totalItems,
      icon: Layers,
      iconColor: '#3b82f6',
      bgColor: 'rgba(59,130,246,0.12)',
    },
    {
      label: 'Collections',
      value: totalCollections,
      icon: FolderOpen,
      iconColor: '#8b5cf6',
      bgColor: 'rgba(139,92,246,0.12)',
    },
    {
      label: 'Favorite Items',
      value: favoriteItems,
      icon: Star,
      iconColor: '#f59e0b',
      bgColor: 'rgba(245,158,11,0.12)',
    },
    {
      label: 'Favorite Collections',
      value: favoriteCollections,
      icon: Folder,
      iconColor: '#10b981',
      bgColor: 'rgba(16,185,129,0.12)',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
          >
            <div
              className="p-2 rounded-md shrink-0"
              style={{ backgroundColor: stat.bgColor }}
            >
              <Icon className="w-5 h-5" style={{ color: stat.iconColor }} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
