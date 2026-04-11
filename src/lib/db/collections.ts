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
  dominantColor: string | null;
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

    const dominantColor = typeEntries[0]?.color ?? null;

    const typeIcons: CollectionTypeIcon[] = typeEntries.map(({ icon, color }) => ({ icon, color }));

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
  dominantColor: string | null;
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
    const dominantColor = sorted[0]?.color ?? null;

    return {
      id: collection.id,
      name: collection.name,
      isFavorite: collection.isFavorite,
      dominantColor,
    };
  });
}

export interface CollectionData {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function createCollection(
  userId: string,
  data: { name: string; description: string | null }
): Promise<CollectionData> {
  const collection = await prisma.collection.create({
    data: {
      name: data.name,
      description: data.description,
      userId,
    },
  });

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  };
}

export interface UserCollection {
  id: string;
  name: string;
}

export async function getUserCollections(userId: string): Promise<UserCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
  return collections;
}

export async function getAllCollections(userId: string): Promise<CollectionCardData[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
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
    const dominantColor = typeEntries[0]?.color ?? null;
    const typeIcons: CollectionTypeIcon[] = typeEntries.map(({ icon, color }) => ({ icon, color }));

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

export interface CollectionWithItems {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  dominantColor: string | null;
  itemCount: number;
}

export async function getCollectionWithItems(
  collectionId: string,
  userId: string
): Promise<CollectionWithItems | null> {
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
    include: {
      items: {
        include: {
          item: {
            include: { type: true },
          },
        },
      },
    },
  });

  if (!collection) return null;

  const typeCounts: Record<string, { count: number; color: string }> = {};
  for (const ci of collection.items) {
    const { type } = ci.item;
    if (!typeCounts[type.id]) {
      typeCounts[type.id] = { count: 0, color: type.color ?? DEFAULT_COLOR };
    }
    typeCounts[type.id].count++;
  }
  const sorted = Object.values(typeCounts).sort((a, b) => b.count - a.count);
  const dominantColor = sorted[0]?.color ?? null;

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    dominantColor,
    itemCount: collection.items.length,
  };
}

export async function getItemsByCollection(
  collectionId: string,
  userId: string
) {
  const items = await prisma.item.findMany({
    where: {
      userId,
      collections: {
        some: { collectionId },
      },
    },
    include: {
      type: true,
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    tags: item.tags.map((t) => t.tag.name),
    createdAt: item.createdAt,
    typeIcon: item.type.icon ?? DEFAULT_ICON,
    typeColor: item.type.color ?? DEFAULT_COLOR,
    typeName: item.type.name,
  }));
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
