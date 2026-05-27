/** UI tokens for provider dashboard notifications (popover + full page). */

export const providerNotificationUi = {
  popover: {
    shell:
      'w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-cosmate-lavender-border bg-card shadow-[0_8px_28px_color-mix(in_oklch,var(--cosmate-pink)_18%,transparent)]',
    header:
      'flex items-center justify-between gap-2 border-b border-cosmate-lavender-border bg-gradient-to-r from-cosmate-soft-pink/40 to-cosmate-lavender-surface/50 px-4 py-3',
    title: 'm-0 text-sm font-bold text-cosmate-ink',
    markAllBtn:
      'shrink-0 rounded-lg border border-cosmate-lavender-border bg-card px-2.5 py-1 text-xs font-semibold text-cosmate-pink transition hover:border-cosmate-pink/40 hover:bg-cosmate-soft-pink/50 disabled:pointer-events-none disabled:opacity-45',
    list: 'max-h-[360px] overflow-y-auto bg-gradient-to-b from-cosmate-soft-pink/15 to-card',
    empty: 'p-8 text-center text-sm font-medium text-cosmate-mauve',
    item:
      'cursor-pointer border-b border-cosmate-lavender-border/60 px-4 py-3 transition last:border-b-0 hover:bg-cosmate-soft-pink/35',
    itemUnread: 'bg-gradient-to-r from-cosmate-soft-pink/50 to-transparent',
    itemHeaderRead: 'm-0 text-sm font-medium leading-snug text-cosmate-mauve',
    itemHeaderUnread: 'm-0 text-sm font-semibold leading-snug text-cosmate-ink',
    itemContent: 'mt-1 line-clamp-2 text-xs leading-relaxed text-cosmate-mauve',
    deleteBtn:
      'shrink-0 rounded-lg border border-cosmate-lavender-border bg-card p-1.5 text-cosmate-mauve transition hover:border-red-200 hover:bg-red-50 hover:text-red-600',
    footer:
      'cursor-pointer border-t border-cosmate-lavender-border bg-gradient-to-r from-cosmate-soft-pink/40 to-cosmate-lavender-surface/40 px-4 py-3 text-center text-sm font-semibold text-cosmate-pink transition hover:bg-cosmate-soft-pink/50',
    unreadDot: 'mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cosmate-pink shadow-sm',
    readDot: 'mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cosmate-lavender-border',
  },
  page: {
    hero: 'mb-6 flex flex-wrap items-center justify-between gap-4',
    heroTitle: 'text-xl font-bold text-cosmate-ink sm:text-2xl',
    heroSubtitle: 'text-sm text-cosmate-mauve',
    markAllBtn:
      'shrink-0 rounded-lg border border-cosmate-lavender-border bg-card px-3 py-2 text-xs font-semibold text-cosmate-pink shadow-sm transition hover:border-cosmate-pink/30 hover:bg-cosmate-soft-pink/40',
    panel:
      'overflow-hidden rounded-2xl border border-cosmate-lavender-border bg-card shadow-[0_4px_24px_color-mix(in_oklch,var(--cosmate-pink)_10%,transparent)]',
    filterNav:
      'flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden',
    filterTab:
      'flex min-w-[9rem] shrink-0 items-center justify-between gap-2 rounded-xl border border-cosmate-lavender-border bg-card/90 px-3 py-2.5 text-left transition lg:min-w-0 lg:w-full hover:border-cosmate-pink/30 hover:bg-cosmate-soft-pink/25',
    filterTabActive:
      'border-cosmate-pink/50 bg-gradient-to-r from-cosmate-soft-pink/50 to-cosmate-lavender-surface/40 shadow-sm ring-1 ring-cosmate-pink/25',
    filterIconWrap:
      'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cosmate-lavender-border bg-cosmate-lavender-surface/40',
    filterIconWrapActive: 'border-cosmate-pink/30 bg-cosmate-soft-pink/50 text-cosmate-pink',
    filterHint:
      'mt-5 rounded-xl border border-cosmate-lavender-border/80 bg-cosmate-lavender-surface/30 p-4 text-xs leading-relaxed text-cosmate-mauve',
    listArea: 'min-w-0 rounded-xl border border-cosmate-lavender-border/60 bg-cosmate-lavender-surface/20 p-3 md:p-4',
    row:
      'relative cursor-pointer rounded-xl border border-cosmate-lavender-border bg-card p-4 text-left shadow-sm transition hover:border-cosmate-pink/30 hover:shadow-[0_4px_16px_color-mix(in_oklch,var(--cosmate-pink)_12%,transparent)]',
    rowUnread: 'border-cosmate-pink/35 bg-gradient-to-br from-cosmate-soft-pink/40 to-card',
    newBadge:
      'shrink-0 rounded-md border border-cosmate-pink/40 bg-cosmate-pink/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cosmate-pink',
    deleteRowBtn:
      'ml-auto inline-flex items-center rounded-lg border border-cosmate-lavender-border bg-card p-2 text-cosmate-mauve transition hover:border-red-200 hover:bg-red-50 hover:text-red-600',
    quickLinkCard:
      'flex flex-col gap-1 rounded-xl border border-cosmate-lavender-border bg-gradient-to-br from-cosmate-soft-pink/30 to-card p-3 text-left shadow-sm transition hover:border-cosmate-pink/30 hover:bg-cosmate-soft-pink/40 sm:p-3.5',
    quickLinksWrap: 'mt-8 border-t border-dashed border-cosmate-lavender-border pt-8',
    tipsBox:
      'mt-4 rounded-xl border border-cosmate-lavender-border bg-cosmate-lavender-surface/40 px-3 py-2 text-xs text-cosmate-mauve',
  },
} as const;

export type ProviderNotificationPopoverUi = typeof providerNotificationUi.popover;
