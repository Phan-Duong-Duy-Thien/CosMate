/**
 * Breadcrumbs Component
 * Reusable breadcrumb navigation
 */
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav className={cn('flex items-center gap-1 text-sm', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isClickable = !isLast && item.to;

        return (
          <span key={index} className="flex items-center gap-1">
            {isClickable ? (
              <Link
                to={item.to}
                className="text-slate-500 decoration-1 underline-offset-2 transition-colors hover:text-pink-600 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast ? 'font-medium text-slate-900' : 'text-slate-500'
                )}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
