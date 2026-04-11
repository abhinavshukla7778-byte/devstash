import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export default function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (page > 3) pages.push('ellipsis');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {page <= 1 ? (
        <span className="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground/40 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
        </span>
      ) : (
        <Link
          href={buildHref(page - 1)}
          className="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}

      {pageNumbers.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="flex items-center justify-center w-9 h-9 text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-md text-sm transition-colors',
              p === page
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {p}
          </Link>
        )
      )}

      {page >= totalPages ? (
        <span className="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground/40 cursor-not-allowed">
          <ChevronRight className="w-4 h-4" />
        </span>
      ) : (
        <Link
          href={buildHref(page + 1)}
          className="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
