import { prisma } from '@/lib/prisma';

export interface ItemTypeCount {
  typeName: string;
  icon: string;
  color: string;
  count: number;
}

export interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  hasPassword: boolean;
  isOAuthOnly: boolean;
  stats: {
    totalItems: number;
    totalCollections: number;
    itemTypeBreakdown: ItemTypeCount[];
  };
}

export async function getProfileData(userId: string): Promise<ProfileData | null> {
  const [user, systemTypes] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: { select: { provider: true } },
        _count: {
          select: {
            items: true,
            collections: true,
          },
        },
      },
    }),
    prisma.itemType.findMany({
      where: { isSystem: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!user) return null;

  const itemCounts = await prisma.item.groupBy({
    by: ['typeId'],
    where: { userId },
    _count: { id: true },
  });

  const countMap = new Map(itemCounts.map((c) => [c.typeId, c._count.id]));

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    hasPassword: !!user.password,
    isOAuthOnly: !user.password && user.accounts.length > 0,
    stats: {
      totalItems: user._count.items,
      totalCollections: user._count.collections,
      itemTypeBreakdown: systemTypes.map((t) => ({
        typeName: t.name,
        icon: t.icon ?? 'Code',
        color: t.color ?? '#3b82f6',
        count: countMap.get(t.id) ?? 0,
      })),
    },
  };
}
