'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MoreHorizontal, Code, Sparkles, Terminal, StickyNote, File, Image, Link, Pencil, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateCollection, deleteCollection } from '@/actions/collections';
import type { CollectionCardData } from '@/lib/db/collections';

const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link,
};

interface CollectionCardProps {
  collection: CollectionCardData;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editName, setEditName] = useState(collection.name);
  const [editDescription, setEditDescription] = useState(collection.description ?? '');
  const [isPending, startTransition] = useTransition();

  function handleCardClick() {
    router.push(`/collections/${collection.id}`);
  }

  function handleEditOpen(e: React.MouseEvent) {
    e.stopPropagation();
    setEditName(collection.name);
    setEditDescription(collection.description ?? '');
    setEditOpen(true);
  }

  function handleDeleteOpen(e: React.MouseEvent) {
    e.stopPropagation();
    setDeleteOpen(true);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateCollection(collection.id, {
        name: editName,
        description: editDescription || null,
      });
      if (result.success) {
        toast.success('Collection updated');
        setEditOpen(false);
        router.refresh();
      } else {
        toast.error(
          typeof result.error === 'string' ? result.error : 'Failed to update collection'
        );
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCollection(collection.id);
      if (result.success) {
        toast.success('Collection deleted');
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to delete collection');
      }
    });
  }

  return (
    <>
      <div
        className="bg-card border rounded-lg p-4 hover:opacity-90 transition-opacity cursor-pointer"
        style={collection.dominantColor ? { borderColor: collection.dominantColor + '55' } : undefined}
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-medium truncate">{collection.name}</span>
            {collection.isFavorite && (
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground shrink-0 -mt-0.5 transition-colors cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditOpen}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteOpen}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Star className="w-4 h-4 mr-2" />
                Favorite
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
        </p>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
          {collection.description}
        </p>
        <div className="flex items-center gap-2">
          {collection.typeIcons.map(({ icon, color }, i) => {
            const TypeIcon = ICON_MAP[icon] ?? Code;
            return <TypeIcon key={i} className="w-3.5 h-3.5" style={{ color }} />;
          })}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor={`edit-name-${collection.id}`}>Name</Label>
              <Input
                id={`edit-name-${collection.id}`}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Collection name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edit-desc-${collection.id}`}>Description</Label>
              <Textarea
                id={`edit-desc-${collection.id}`}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending || !editName.trim()}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{collection.name}&quot;? Items in this
              collection will not be deleted — they will just be removed from this collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
