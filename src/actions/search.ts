'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export interface SearchItem {
  id: string;
  title: string;
  typeName: string;
  typeIcon: string;
  typeColor: string;
  preview: string | null;
}

export interface SearchCollection {
  id: string;
  name: string;
  itemCount: number;
}

export interface SearchData {
  items: SearchItem[];
  collections: SearchCollection[];
}

export async function getSearchData(): Promise<SearchData> {
  const session = await auth();
  if (!session?.user?.id) {
    return { items: [], collections: [] };
  }

  const userId = session.user.id;

  const [rawItems, rawCollections] = await Promise.all([
    prisma.item.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        content: true,
        type: { select: { name: true, icon: true, color: true } },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.collection.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        _count: { select: { items: true } },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  const items: SearchItem[] = rawItems.map((item) => ({
    id: item.id,
    title: item.title,
    typeName: item.type.name,
    typeIcon: item.type.icon ?? 'Code',
    typeColor: item.type.color ?? '#3b82f6',
    preview: item.content ? item.content.slice(0, 80) : null,
  }));

  const collections: SearchCollection[] = rawCollections.map((col) => ({
    id: col.id,
    name: col.name,
    itemCount: col._count.items,
  }));

  return { items, collections };
}
