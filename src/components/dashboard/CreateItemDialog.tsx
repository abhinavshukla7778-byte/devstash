'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createItem } from '@/actions/items';
import { getUserCollections } from '@/actions/collections';
import CollectionSelector from '@/components/ui/CollectionSelector';

const ITEM_TYPES = ['snippet', 'prompt', 'command', 'note', 'link'] as const;
type ItemTypeName = (typeof ITEM_TYPES)[number];

const CONTENT_TYPES = new Set<ItemTypeName>(['snippet', 'prompt', 'command', 'note']);
const LANGUAGE_TYPES = new Set<ItemTypeName>(['snippet', 'command']);
const URL_TYPES = new Set<ItemTypeName>(['link']);

interface Collection {
  id: string;
  name: string;
}

interface FormState {
  title: string;
  description: string;
  content: string;
  url: string;
  language: string;
  tags: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  content: '',
  url: '',
  language: '',
  tags: '',
};

export default function CreateItemDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ItemTypeName>('snippet');
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    getUserCollections().then((result) => {
      if (result.success && result.data) setCollections(result.data);
    });
  }, [open]);

  const showContent = CONTENT_TYPES.has(selectedType);
  const showLanguage = LANGUAGE_TYPES.has(selectedType);
  const showUrl = URL_TYPES.has(selectedType);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTypeChange(value: ItemTypeName | null) {
    if (value) setSelectedType(value);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setForm(EMPTY_FORM);
      setSelectedType('snippet');
      setSelectedCollectionIds([]);
    }
    setOpen(next);
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setSaving(true);

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await createItem({
      typeName: selectedType,
      title: form.title,
      description: form.description || null,
      content: form.content || null,
      url: form.url || null,
      language: form.language || null,
      tags,
      collectionIds: selectedCollectionIds,
    });

    setSaving(false);

    if (!result.success) {
      const msg =
        typeof result.error === 'string' ? result.error : 'Failed to create item';
      toast.error(msg);
      return;
    }

    toast.success('Item created');
    handleOpenChange(false);
    router.refresh();
  }

  const isValid = form.title.trim() && (!showUrl || form.url.trim());

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
        <Plus className="w-4 h-4" />
        New Item
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Type */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Type
            </label>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEM_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Title"
              className="text-sm"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Description
            </label>
            <Textarea
              value={form.description}
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
                value={form.content}
                onChange={(e) => setField('content', e.target.value)}
                placeholder="Content"
                rows={5}
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
                value={form.language}
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
                URL <span className="text-destructive">*</span>
              </label>
              <Input
                value={form.url}
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
              value={form.tags}
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
              selected={selectedCollectionIds}
              onChange={setSelectedCollectionIds}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={saving || !isValid}
            >
              {saving ? 'Creating…' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
