import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function UserAvatar({ name, image, className }: UserAvatarProps) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? 'User avatar'}
        className={cn('rounded-full object-cover', className)}
      />
    );
  }

  const initials = name ? getInitials(name) : '?';

  return (
    <div
      className={cn(
        'rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold',
        className,
      )}
    >
      {initials}
    </div>
  );
}
