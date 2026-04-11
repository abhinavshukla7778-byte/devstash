'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  createCollection as dbCreateCollection,
  getUserCollections as dbGetUserCollections,
  updateCollection as dbUpdateCollection,
  deleteCollection as dbDeleteCollection,
} from '@/lib/db/collections';
import type { CollectionData, UserCollection } from '@/lib/db/collections';

interface ToggleCollectionFavoriteResult {
  success: boolean;
  isFavorite?: boolean;
  error?: string;
}

export async function toggleCollectionFavorite(
  collectionId: string
): Promise<ToggleCollectionFavoriteResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { userId: true, isFavorite: true },
  });
  if (!collection || collection.userId !== session.user.id) {
    return { success: false, error: 'Not found' };
  }

  const updated = await prisma.collection.update({
    where: { id: collectionId },
    data: { isFavorite: !collection.isFavorite },
    select: { isFavorite: true },
  });

  return { success: true, isFavorite: updated.isFavorite };
}

interface GetUserCollectionsResult {
  success: boolean;
  data?: UserCollection[];
  error?: string;
}

export async function getUserCollections(): Promise<GetUserCollectionsResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  const data = await dbGetUserCollections(session.user.id);
  return { success: true, data };
}

const CreateCollectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().nullable().optional(),
});

type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;

interface CreateCollectionResult {
  success: boolean;
  data?: CollectionData;
  error?: string | Record<string, string[]>;
}

const UpdateCollectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().nullable().optional(),
});

type UpdateCollectionInput = z.infer<typeof UpdateCollectionSchema>;

interface UpdateCollectionResult {
  success: boolean;
  data?: CollectionData;
  error?: string | Record<string, string[]>;
}

export async function updateCollection(
  id: string,
  input: UpdateCollectionInput
): Promise<UpdateCollectionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = UpdateCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { name, description } = parsed.data;

  try {
    const collection = await dbUpdateCollection(id, session.user.id, {
      name,
      description: description ?? null,
    });
    return { success: true, data: collection };
  } catch {
    return { success: false, error: 'Failed to update collection' };
  }
}

interface DeleteCollectionResult {
  success: boolean;
  error?: string;
}

export async function deleteCollection(id: string): Promise<DeleteCollectionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await dbDeleteCollection(id, session.user.id);
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to delete collection' };
  }
}

export async function createCollection(
  input: CreateCollectionInput
): Promise<CreateCollectionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = CreateCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { name, description } = parsed.data;

  try {
    const collection = await dbCreateCollection(session.user.id, {
      name,
      description: description ?? null,
    });
    return { success: true, data: collection };
  } catch {
    return { success: false, error: 'Failed to create collection' };
  }
}
