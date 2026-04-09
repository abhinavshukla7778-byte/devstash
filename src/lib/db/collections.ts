import { prisma } from '@/lib/prisma';

const DEFAULT_COLOR = '#3b82f6';
const DEFAULT_ICON = 'Code';

export interface CollectionTypeIcon {
  icon: string;
  color: string;
}

export interface CollectionCardData {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  updatedAt: Date;
  dominantColor: string;
  typeIcons: CollectionTypeIcon[];
}

export interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export async function getRecentCollections(limit = 6): Promise<CollectionCardData[]> {
  const collections = await prisma.collection.findMany({
    include: {
      items: {
        include: {
          item: {
            include: {
              type: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });

  return collections.map((collection) => {
    const typeCounts: Record<string, { count: number; icon: string; color: string }> = {};

    for (const ci of collection.items) {
      const { type } = ci.item;
      if (!typeCounts[type.id]) {
        typeCounts[type.id] = {
          count: 0,
          icon: type.icon ?? DEFAULT_ICON,
          color: type.color ?? DEFAULT_COLOR,
        };
      }
      typeCounts[type.id].count++;
    }

    const typeEntries = Object.values(typeCounts).sort((a, b) => b.count - a.count);

    const dominantColor = typeEntries[0]?.color ?? DEFAULT_COLOR;

    const typeIcons: CollectionTypeIcon[] =
      typeEntries.length > 0
        ? typeEntries.map(({ icon, color }) => ({ icon, color }))
        : [{ icon: DEFAULT_ICON, color: DEFAULT_COLOR }];

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      updatedAt: collection.updatedAt,
      dominantColor,
      typeIcons,
    };
  });
}

export interface SidebarCollection {
  id: string;
  name: string;
  isFavorite: boolean;
  dominantColor: string;
}

export async function getSidebarCollections(): Promise<SidebarCollection[]> {
  const collections = await prisma.collection.findMany({
    include: {
      items: {
        include: {
          item: {
            include: { type: true },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  return collections.map((collection) => {
    const typeCounts: Record<string, { count: number; color: string }> = {};

    for (const ci of collection.items) {
      const { type } = ci.item;
      if (!typeCounts[type.id]) {
        typeCounts[type.id] = { count: 0, color: type.color ?? DEFAULT_COLOR };
      }
      typeCounts[type.id].count++;
    }

    const sorted = Object.values(typeCounts).sort((a, b) => b.count - a.count);
    const dominantColor = sorted[0]?.color ?? DEFAULT_COLOR;

    return {
      id: collection.id,
      name: collection.name,
      isFavorite: collection.isFavorite,
      dominantColor,
    };
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] = await Promise.all([
    prisma.item.count(),
    prisma.collection.count(),
    prisma.item.count({ where: { isFavorite: true } }),
    prisma.collection.count({ where: { isFavorite: true } }),
  ]);

  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}
