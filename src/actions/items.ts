'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateItem as dbUpdateItem, createItem as dbCreateItem } from '@/lib/db/items';
import type { ItemDetailData } from '@/lib/db/items';

const CONTENT_TYPES = new Set(['snippet', 'prompt', 'command', 'note']);
const LANGUAGE_TYPES = new Set(['snippet', 'command']);
const URL_TYPES = new Set(['link']);

const CreateItemSchema = z.object({
  typeName: z.string().min(1),
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.string().trim().nullable().optional(),
  language: z.string().trim().nullable().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
}).superRefine((data, ctx) => {
  if (URL_TYPES.has(data.typeName) && !data.url?.trim()) {
    ctx.addIssue({ code: 'custom', message: 'URL is required', path: ['url'] });
  }
  if (data.url?.trim()) {
    try {
      new URL(data.url.trim());
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Must be a valid URL', path: ['url'] });
    }
  }
});

type CreateItemInput = z.infer<typeof CreateItemSchema>;

interface CreateItemResult {
  success: boolean;
  data?: ItemDetailData;
  error?: string | Record<string, string[]>;
}

export async function createItem(input: CreateItemInput): Promise<CreateItemResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = CreateItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { typeName, title, description, content, url, language, tags } = parsed.data;

  const showContent = CONTENT_TYPES.has(typeName);
  const showLanguage = LANGUAGE_TYPES.has(typeName);
  const showUrl = URL_TYPES.has(typeName);

  try {
    const item = await dbCreateItem(session.user.id, {
      typeName,
      title,
      description: description ?? null,
      content: showContent ? (content ?? null) : null,
      url: showUrl ? (url ?? null) : null,
      language: showLanguage ? (language ?? null) : null,
      tags,
    });
    return { success: true, data: item };
  } catch {
    return { success: false, error: 'Failed to create item' };
  }
}

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
