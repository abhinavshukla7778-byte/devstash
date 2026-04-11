'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Pin, Copy, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateItem, deleteItem, toggleItemFavorite } from '@/actions/items';
import { getUserCollections } from '@/actions/collections';
import CollectionSelector from '@/components/ui/CollectionSelector';
import type { ItemDetailData } from '@/lib/db/items';

interface Collection {
  id: string;
  name: string;
}

// Types that show the content textarea
const CONTENT_TYPES = new Set(['snippet', 'prompt', 'command', 'note']);
// Types that show the language field
const LANGUAGE_TYPES = new Set(['snippet', 'command']);
// Types that show the URL field
const URL_TYPES = new Set(['url', 'link']);

interface ItemDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

interface EditState {
  title: string;
  description: string;
  content: string;
  url: string;
  language: string;
  tags: string; // comma-separated
  collectionIds: string[];
}

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function DrawerSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16 ml-auto" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function buildEditState(item: ItemDetailData): EditState {
  return {
    title: item.title,
    description: item.description ?? '',
    content: item.content ?? '',
    url: item.url ?? '',
    language: item.language ?? '',
    tags: item.tags.join(', '),
    collectionIds: item.collections.map((c) => c.id),
  };
}

export default function ItemDrawer({ itemId, onClose }: ItemDrawerProps) {
  const router = useRouter();
  const [item, setItem] = useState<ItemDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  useEffect(() => {
    if (!itemId) {
      setItem(null);
      setEditMode(false);
      setEditState(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setItem(null);
    setEditMode(false);
    setEditState(null);

    fetch(`/api/items/${itemId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setItem(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [itemId]);

  function handleEditClick() {
    if (!item) return;
    setEditState(buildEditState(item));
    setEditMode(true);
    getUserCollections().then((result) => {
      if (result.success && result.data) setCollections(result.data);
    });
  }

  function handleCancel() {
    setEditMode(false);
    setEditState(null);
  }

  async function handleSave() {
    if (!item || !editState) return;
    setSaving(true);

    const tags = editState.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await updateItem(item.id, {
      title: editState.title,
      description: editState.description || null,
      content: editState.content || null,
      url: editState.url || null,
      language: editState.language || null,
      tags,
      collectionIds: editState.collectionIds,
    });

    setSaving(false);

    if (!result.success) {
      const msg = typeof result.error === 'string'
        ? result.error
        : 'Failed to save changes';
      toast.error(msg);
      return;
    }

    setItem(result.data!);
    setEditMode(false);
    setEditState(null);
    toast.success('Item updated');
    router.refresh();
  }

  async function handleDelete() {
    if (!item) return;
    setDeleting(true);
    const result = await deleteItem(item.id);
    setDeleting(false);
    if (!result.success) {
      toast.error(result.error ?? 'Failed to delete item');
      return;
    }
    toast.success('Item deleted');
    onClose();
    router.refresh();
  }

  async function handleFavoriteToggle() {
    if (!item || togglingFavorite) return;
    setTogglingFavorite(true);
    const prevFavorite = item.isFavorite;
    setItem((prev) => prev ? { ...prev, isFavorite: !prev.isFavorite } : prev);
    const result = await toggleItemFavorite(item.id);
    setTogglingFavorite(false);
    if (!result.success) {
      setItem((prev) => prev ? { ...prev, isFavorite: prevFavorite } : prev);
      toast.error(result.error ?? 'Failed to update favorite');
      return;
    }
    toast.success(result.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    router.refresh();
  }

  function setField<K extends keyof EditState>(key: K, value: EditState[K]) {
    setEditState((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  const typeLower = item?.typeName?.toLowerCase() ?? '';
  const showContent = CONTENT_TYPES.has(typeLower);
  const showLanguage = LANGUAGE_TYPES.has(typeLower);
  const showUrl = URL_TYPES.has(typeLower);

  return (
    <>
    <Sheet open={!!itemId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        {loading && (
          <>
            <SheetHeader className="px-6 pt-6 pb-0">
              <SheetTitle>
                <Skeleton className="h-6 w-48" />
              </SheetTitle>
            </SheetHeader>
            <DrawerSkeleton />
          </>
        )}

        {!loading && item && !editMode && (
          <>
            {/* Header — view mode */}
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
              <SheetTitle className="text-left text-base font-semibold leading-snug pr-8">
                {item.title}
              </SheetTitle>
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                <span
                  className="px-2 py-0.5 text-xs rounded-full font-medium"
                  style={{ backgroundColor: `${item.typeColor}20`, color: item.typeColor }}
                >
                  {item.typeName}
                </span>
                {item.language && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground font-medium">
                    {item.language}
                  </span>
                )}
              </div>
            </SheetHeader>

            {/* Action bar — view mode */}
            <div className="flex items-center gap-1 px-6 py-3 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 text-xs ${item.isFavorite ? 'text-yellow-500' : ''}`}
                onClick={handleFavoriteToggle}
                disabled={togglingFavorite}
              >
                <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                Favorite
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <Pin className="w-3.5 h-3.5" />
                Pin
              </Button>
              {item.content && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => navigator.clipboard.writeText(item.content ?? '')}
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </Button>
              )}
              <div className="ml-auto flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={handleEditClick}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs text-destructive hover:text-destructive"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Body — view mode */}
            <div className="px-6 py-4 space-y-5">
              {item.description && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Description</p>
                  <p className="text-sm">{item.description}</p>
                </div>
              )}

              {item.content && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Content</p>
                  <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                    {item.content}
                  </pre>
                </div>
              )}

              {item.url && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">URL</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline break-all"
                  >
                    {item.url}
                  </a>
                </div>
              )}

              {item.tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.collections.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Collections</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.collections.map((col) => (
                      <span
                        key={col.id}
                        className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-md"
                      >
                        {col.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Details</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Updated</span>
                    <span>{formatDate(item.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && item && editMode && editState && (
          <>
            {/* Header — edit mode */}
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="px-2 py-0.5 text-xs rounded-full font-medium"
                  style={{ backgroundColor: `${item.typeColor}20`, color: item.typeColor }}
                >
                  {item.typeName}
                </span>
              </div>
              <SheetTitle className="sr-only">Edit {item.typeName}</SheetTitle>
            </SheetHeader>

            {/* Action bar — edit mode */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-border">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || !editState.title.trim()}
                className="text-xs"
              >
                {saving ? 'Saving…' : 'Save'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={saving}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>

            {/* Body — edit mode */}
            <div className="px-6 py-4 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  value={editState.title}
                  onChange={(e) => setField('title', e.target.value)}
                  placeholder="Title"
                  className="text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Description
                </label>
                <Textarea
                  value={editState.description}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="Optional description"
                  rows={2}
                  className="text-sm resize-none"
                />
              </div>

              {/* Content — snippet, prompt, command, note */}
              {showContent && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Content
                  </label>
                  <Textarea
                    value={editState.content}
                    onChange={(e) => setField('content', e.target.value)}
                    placeholder="Content"
                    rows={6}
                    className="text-sm font-mono resize-y"
                  />
                </div>
              )}

              {/* Language — snippet, command */}
              {showLanguage && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Language
                  </label>
                  <Input
                    value={editState.language}
                    onChange={(e) => setField('language', e.target.value)}
                    placeholder="e.g. typescript, bash"
                    className="text-sm"
                  />
                </div>
              )}

              {/* URL — link */}
              {showUrl && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    URL
                  </label>
                  <Input
                    value={editState.url}
                    onChange={(e) => setField('url', e.target.value)}
                    placeholder="https://..."
                    className="text-sm"
                    type="url"
                  />
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Tags
                </label>
                <Input
                  value={editState.tags}
                  onChange={(e) => setField('tags', e.target.value)}
                  placeholder="react, hooks, typescript"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">Comma-separated</p>
              </div>

              {/* Collections */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Collections
                </label>
                <CollectionSelector
                  collections={collections}
                  selected={editState.collectionIds}
                  onChange={(ids) => setField('collectionIds', ids)}
                />
              </div>

              {/* Non-editable details */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Details</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Updated</span>
                    <span>{formatDate(item.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>

    <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete item?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &ldquo;{item?.title}&rdquo;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
