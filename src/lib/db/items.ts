import { prisma } from '@/lib/prisma';

const DEFAULT_ICON = 'Code';
const DEFAULT_COLOR = '#3b82f6';

export interface ItemCardData {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: Date;
  typeIcon: string;
  typeColor: string;
  typeName: string;
}

function mapItem(item: {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  type: { name: string; icon: string | null; color: string | null };
  tags: { tag: { name: string } }[];
}): ItemCardData {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    tags: item.tags.map((t) => t.tag.name),
    createdAt: item.createdAt,
    typeIcon: item.type.icon ?? DEFAULT_ICON,
    typeColor: item.type.color ?? DEFAULT_COLOR,
    typeName: item.type.name,
  };
}

export async function getPinnedItems(): Promise<ItemCardData[]> {
  const items = await prisma.item.findMany({
    where: { isPinned: true },
    include: {
      type: true,
      tags: { include: { tag: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });
  return items.map(mapItem);
}

export async function getRecentItems(limit = 10): Promise<ItemCardData[]> {
  const items = await prisma.item.findMany({
    include: {
      type: true,
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return items.map(mapItem);
}
