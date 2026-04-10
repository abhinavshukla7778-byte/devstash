import { prisma } from '@/lib/prisma';

const DEFAULT_ICON = 'Code';
const DEFAULT_COLOR = '#3b82f6';

export interface ItemCardData {
  id: string;
  title: string;
  content: string | null;
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
  content: string | null;
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
    content: item.content,
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

export interface SidebarItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export async function getSystemItemTypes(): Promise<SidebarItemType[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    include: { _count: { select: { items: true } } },
    orderBy: { name: 'asc' },
  });

  return types.map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon ?? DEFAULT_ICON,
    color: t.color ?? DEFAULT_COLOR,
    count: t._count.items,
  }));
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

export interface ItemDetailData {
  id: string;
  title: string;
  content: string | null;
  description: string | null;
  url: string | null;
  language: string | null;
  contentType: string;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  collections: { id: string; name: string }[];
  createdAt: Date;
  updatedAt: Date;
  typeIcon: string;
  typeColor: string;
  typeName: string;
}

export async function getItemById(id: string): Promise<ItemDetailData | null> {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      type: true,
      tags: { include: { tag: true } },
      collections: { include: { collection: true } },
    },
  });

  if (!item) return null;

  return {
    id: item.id,
    title: item.title,
    content: item.content,
    description: item.description,
    url: item.url,
    language: item.language,
    contentType: item.contentType,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    tags: item.tags.map((t) => t.tag.name),
    collections: item.collections.map((c) => ({
      id: c.collection.id,
      name: c.collection.name,
    })),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    typeIcon: item.type.icon ?? DEFAULT_ICON,
    typeColor: item.type.color ?? DEFAULT_COLOR,
    typeName: item.type.name,
  };
}

export async function updateItem(
  id: string,
  userId: string,
  data: {
    title: string;
    description: string | null;
    content: string | null;
    url: string | null;
    language: string | null;
    tags: string[];
  }
): Promise<ItemDetailData> {
  // Disconnect all existing tags then connect-or-create new ones
  const item = await prisma.item.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      url: data.url,
      language: data.language,
      updatedAt: new Date(),
      tags: {
        deleteMany: {},
        create: data.tags.map((name) => ({
          tag: {
            connectOrCreate: {
              where: { name_userId: { name, userId } },
              create: { name, user: { connect: { id: userId } } },
            },
          },
        })),
      },
    },
    include: {
      type: true,
      tags: { include: { tag: true } },
      collections: { include: { collection: true } },
    },
  });

  return {
    id: item.id,
    title: item.title,
    content: item.content,
    description: item.description,
    url: item.url,
    language: item.language,
    contentType: item.contentType,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    tags: item.tags.map((t) => t.tag.name),
    collections: item.collections.map((c) => ({
      id: c.collection.id,
      name: c.collection.name,
    })),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    typeIcon: item.type.icon ?? DEFAULT_ICON,
    typeColor: item.type.color ?? DEFAULT_COLOR,
    typeName: item.type.name,
  };
}

export async function getItemsByType(typeName: string): Promise<{ items: ItemCardData[]; typeColor: string; typeName: string } | null> {
  const type = await prisma.itemType.findFirst({
    where: { name: typeName, isSystem: true },
  });

  if (!type) return null;

  const items = await prisma.item.findMany({
    where: { typeId: type.id },
    include: {
      type: true,
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    items: items.map(mapItem),
    typeColor: type.color ?? DEFAULT_COLOR,
    typeName: type.name,
  };
}
