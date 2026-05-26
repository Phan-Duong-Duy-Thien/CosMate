/** Shared Tailwind classes for provider dashboard pages (subscription, wallet, …). */

export const providerPortalUi = {
  subtitleBar:
    'mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cosmate-lavender-border bg-gradient-to-r from-cosmate-soft-pink/30 to-transparent px-4 py-3 sm:px-5',
  subtitleText: 'max-w-2xl text-sm leading-relaxed text-cosmate-mauve',

  heroCard:
    'overflow-hidden rounded-2xl border border-cosmate-lavender-border bg-gradient-to-br from-cosmate-soft-pink/50 via-card to-cosmate-lavender-surface/80 shadow-[0_4px_24px_color-mix(in_oklch,var(--cosmate-pink)_12%,transparent)]',
  heroHeader:
    'border-b border-cosmate-lavender-border/80 bg-gradient-to-r from-cosmate-pink/10 to-cosmate-lavender-surface/60 px-5 py-4 sm:px-6',
  heroBody: 'space-y-5 p-5 sm:p-6',
  heroLabel: 'text-xs font-semibold uppercase tracking-wider text-cosmate-mauve',
  heroTitle: 'text-xl font-bold text-cosmate-ink sm:text-2xl',
  iconWrap: 'flex h-10 w-10 items-center justify-center rounded-xl bg-cosmate-pink/15 text-cosmate-pink',

  statCardPink:
    'rounded-xl border border-cosmate-lavender-border bg-card/90 p-4 shadow-sm backdrop-blur-sm',
  statCardGreen:
    'rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-card p-4 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/30',
  statLabel: 'text-sm font-medium text-cosmate-mauve',
  statValuePrimary: 'text-2xl font-bold tabular-nums text-primary sm:text-3xl',
  statValuePink: 'text-2xl font-bold tabular-nums text-cosmate-pink sm:text-3xl',
  statValueGreen: 'text-2xl font-bold tabular-nums text-cosmate-success sm:text-3xl',
  statSuffix: 'ml-1.5 text-base font-semibold text-cosmate-mauve',

  sectionWrap: 'mt-8',
  sectionTitle: 'mb-5 border-l-4 border-cosmate-pink pl-4',
  sectionHeading: 'text-lg font-bold text-cosmate-ink',
  sectionSubheading: 'mt-1 text-sm text-cosmate-mauve',

  innerPanel:
    'rounded-xl border border-cosmate-lavender-border/80 bg-cosmate-lavender-surface/40 px-4 py-3',
  loadingBox:
    'flex items-center justify-center rounded-2xl border border-cosmate-lavender-border bg-gradient-to-br from-cosmate-soft-pink/40 to-cosmate-lavender-surface py-16',
  emptyBox:
    'rounded-xl border border-dashed border-cosmate-lavender-border bg-cosmate-lavender-surface/30 px-4 py-8 text-center text-sm text-cosmate-mauve',

  transactionList:
    'divide-y divide-cosmate-lavender-border/60 overflow-hidden rounded-xl border border-cosmate-lavender-border bg-card/90',
  transactionRow:
    'flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-cosmate-lavender-surface/30 sm:px-5',

  primaryBtn:
    '!h-10 !rounded-lg !px-5 !font-semibold shadow-[0_4px_14px_color-mix(in_oklch,var(--cosmate-pink)_35%,transparent)]',
  defaultBtn: '!h-10 !rounded-lg',

  formPanel: 'rounded-xl border border-cosmate-lavender-border bg-card/90 p-5 shadow-sm sm:p-6',
  fieldLabel: 'text-xs font-semibold uppercase tracking-wide text-cosmate-mauve',
} as const;
