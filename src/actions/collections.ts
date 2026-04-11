'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { createCollection as dbCreateCollection } from '@/lib/db/collections';
import type { CollectionData } from '@/lib/db/collections';

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
