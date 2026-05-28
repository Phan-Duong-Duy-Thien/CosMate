import { VI } from '@/shared/i18n/vi';
import { cn } from '@/lib/utils';

type ProviderReplyBlockVariant = 'indigo' | 'lavender' | 'neutral';

type ProviderReplyBlockProps = {
  providerReply: string | null | undefined;
  repliedAt?: string | null;
  variant?: ProviderReplyBlockVariant;
  className?: string;
};

function formatRepliedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const variantStyles: Record<ProviderReplyBlockVariant, string> = {
  indigo:
    'border-indigo-950/25 bg-gradient-to-br from-violet-50 to-pink-50/80 text-indigo-950',
  lavender: 'border-cosmate-lavender-border bg-cosmate-lavender-surface/60 text-cosmate-ink',
  neutral: 'border-border bg-muted/40 text-foreground',
};

export function ProviderReplyBlock({
  providerReply,
  repliedAt,
  variant = 'indigo',
  className,
}: ProviderReplyBlockProps) {
  const content = providerReply?.trim();
  if (!content) return null;

  return (
    <div
      className={cn(
        'mt-3 rounded-xl border-[2px] p-3',
        variantStyles[variant],
        className
      )}
    >
      <p className="text-xs font-extrabold uppercase tracking-wide opacity-75">
        {VI.provider.reviews.replySection}
      </p>
      <p className="mt-1.5 whitespace-pre-wrap text-sm font-semibold leading-relaxed opacity-90">
        {content}
      </p>
      {repliedAt ? (
        <p className="mt-2 text-[11px] font-semibold opacity-60">
          {VI.provider.reviews.replyAt}: {formatRepliedAt(repliedAt)}
        </p>
      ) : null}
    </div>
  );
}
