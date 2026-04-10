'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateItem as dbUpdateItem } from '@/lib/db/items';
import type { ItemDetailData } from '@/lib/db/items';

interface DeleteItemResult {
  success: boolean;
  error?: string;
}

export async function deleteItem(itemId: string): Promise<DeleteItemResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { userId: true },
  });
  if (!item || item.userId !== session.user.id) {
    return { success: false, error: 'Not found' };
  }

  await prisma.item.delete({ where: { id: itemId } });

  return { success: true };
}

const UpdateItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.string().trim().url('Must be a valid URL').nullable().optional(),
  language: z.string().trim().nullable().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
});

type UpdateItemInput = z.infer<typeof UpdateItemSchema>;

interface UpdateItemResult {
  success: boolean;
  data?: ItemDetailData;
  error?: string | Record<string, string[]>;
}

export async function updateItem(
  itemId: string,
  input: UpdateItemInput
): Promise<UpdateItemResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = UpdateItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  // Verify ownership
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { userId: true },
  });
  if (!item || item.userId !== session.user.id) {
    return { success: false, error: 'Not found' };
  }

  const { title, description, content, url, language, tags } = parsed.data;

  const updated = await dbUpdateItem(itemId, session.user.id, {
    title,
    description: description ?? null,
    content: content ?? null,
    url: url ?? null,
    language: language ?? null,
    tags,
  });

  return { success: true, data: updated };
}
