import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Code, Sparkles, Terminal, StickyNote, File, Image, Link2 } from 'lucide-react';
import { auth } from '@/auth';
import { getProfileData } from '@/lib/db/profile';
import UserAvatar from '@/components/ui/UserAvatar';
import { Separator } from '@/components/ui/separator';
import ChangePasswordDialog from '@/components/profile/ChangePasswordDialog';
import DeleteAccountDialog from '@/components/profile/DeleteAccountDialog';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: Link2,
};

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const profile = await getProfileData(session.user.id);
  if (!profile) redirect('/sign-in');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold">Profile</h1>

        {/* User info */}
        <section className="rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Account
          </h2>
          <div className="flex items-center gap-4">
            <UserAvatar
              name={profile.name}
              image={profile.image}
              className="w-16 h-16 text-xl shrink-0"
            />
            <div className="space-y-1 min-w-0">
              <p className="font-semibold text-lg truncate">{profile.name ?? 'No name'}</p>
              <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
              <p className="text-xs text-muted-foreground">
                Member since {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
        </section>

        {/* Usage stats */}
        <section className="rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Usage
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md bg-muted/40 px-4 py-3">
              <p className="text-2xl font-bold">{profile.stats.totalItems}</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
            <div className="rounded-md bg-muted/40 px-4 py-3">
              <p className="text-2xl font-bold">{profile.stats.totalCollections}</p>
              <p className="text-sm text-muted-foreground">Collections</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">Items by Type</p>
            <ul className="space-y-1.5">
              {profile.stats.itemTypeBreakdown.map((t) => {
                const Icon = iconMap[t.icon] ?? Code;
                return (
                  <li key={t.typeName} className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" style={{ color: t.color }} />
                    <span className="text-sm capitalize flex-1">{t.typeName}s</span>
                    <span className="text-sm font-medium tabular-nums">{t.count}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Account actions */}
        <section className="rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Account Actions
          </h2>

          {!profile.isOAuthOnly && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
              <ChangePasswordDialog />
            </div>
          )}

          {!profile.isOAuthOnly && <Separator />}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground">
                Permanently remove your account and all data
              </p>
            </div>
            <DeleteAccountDialog />
          </div>
        </section>
      </div>
    </div>
  );
}
