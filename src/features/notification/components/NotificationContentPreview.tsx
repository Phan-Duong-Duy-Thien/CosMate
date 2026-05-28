import { formatNotificationDisplayText } from '../utils/formatNotificationDisplayText';
import {
  parseNotificationContent,
  shortenGenericUrl,
} from '../utils/notificationList';

type NotificationContentPreviewProps = {
  content: string;
  variant?: 'cosplayer' | 'provider';
};

function tokensSingleUrl(s: string): boolean {
  return /^https?:\/\//i.test(s) && s.split(/\s+/).filter(Boolean).length === 1;
}

export function NotificationContentPreview({
  content,
  variant = 'cosplayer',
}: NotificationContentPreviewProps) {
  const parsed = parseNotificationContent(formatNotificationDisplayText(content));

  const imgClass =
    variant === 'provider'
      ? 'max-h-36 w-full max-w-xs rounded-lg border border-cosmate-lavender-border object-cover shadow-sm'
      : 'max-h-36 w-full max-w-xs rounded-lg border-[3px] border-indigo-950 object-cover shadow-[4px_4px_0_0_#1e1b4b]';

  const bodyTextClass =
    variant === 'provider'
      ? 'mt-2 text-xs font-medium leading-relaxed text-cosmate-mauve line-clamp-3'
      : 'mt-2 text-xs font-medium leading-relaxed text-slate-600 line-clamp-3';

  const labelClass =
    variant === 'provider'
      ? 'mb-2 inline-flex items-center rounded-md border border-cosmate-lavender-border bg-cosmate-lavender-surface/50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-cosmate-mauve'
      : 'mb-2 inline-flex items-center rounded-md border-2 border-indigo-950/80 bg-white px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-indigo-900';

  if (parsed.mode === 'image-only') {
    return (
      <div className="mt-3">
        <p className={labelClass}>Ảnh đính kèm</p>
        <div className="overflow-hidden rounded-xl">
          <img
            src={parsed.url}
            alt=""
            className={imgClass}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>
    );
  }

  if (parsed.mode === 'text-with-image') {
    return (
      <div className="mt-3 space-y-2">
        {parsed.text ? (
          <p
            className={
              variant === 'provider'
                ? 'text-xs font-medium leading-relaxed text-cosmate-ink/90 line-clamp-3'
                : 'text-xs font-semibold leading-relaxed text-indigo-950/90 line-clamp-3'
            }
          >
            {parsed.text}
          </p>
        ) : (
          <p className="text-xs font-semibold italic text-slate-500">Tin nhắn kèm ảnh</p>
        )}
        <img
          src={parsed.imageUrl}
          alt=""
          className={imgClass}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  const body =
    parsed.text && tokensSingleUrl(parsed.text.trim())
      ? shortenGenericUrl(parsed.text)
      : parsed.text;

  return <p className={bodyTextClass}>{body}</p>;
}
