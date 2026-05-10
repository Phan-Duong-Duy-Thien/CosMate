/**
 * Lớp UI dùng chung cho chat: token nền/viền + accent hồng CosMate.
 * Không dùng màu primary (tím) cho bubble tin nhắn của mình — dùng --gradient-chat-mine / cosmate-pink.
 */
export const CHAT_UI = {
  popupShell:
    "fixed bottom-4 right-4 z-50 flex h-[500px] w-[460px] overflow-hidden rounded-2xl border border-cosmate-lavender-border bg-card shadow-2xl",
  panel: "overflow-hidden rounded-xl border border-cosmate-lavender-border bg-card shadow-sm",
  providerShell: "flex h-[calc(100vh-180px)] overflow-hidden rounded-xl border border-cosmate-lavender-border bg-card",
  pageCanvas: "bg-cosmate-soft-pink/35",
  sidebar: "flex shrink-0 flex-col border-cosmate-lavender-border bg-cosmate-lavender-surface/40",
  sidebarBorder: "border-r border-cosmate-lavender-border",
  headerBar: "flex shrink-0 items-center border-b border-cosmate-lavender-border bg-card",
  messageEmpty: "flex h-full w-full flex-col items-center justify-center gap-2 bg-cosmate-soft-pink/20 text-muted-foreground",
  messageScroll: "flex h-full flex-1 flex-col overflow-y-auto bg-cosmate-soft-pink/15",
  messageScrollPad: "px-3 py-2",
  footerBar: "flex shrink-0 items-start gap-2 border-t border-cosmate-lavender-border bg-card",
  avatarRing: "ring-2 ring-card shadow-sm",
  avatarFallback:
    "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmate-soft-pink to-cosmate-lavender-surface text-[10px] font-semibold text-cosmate-pink shadow-sm ring-2 ring-card md:text-xs",
  searchActive: "bg-cosmate-soft-pink text-cosmate-pink",
  searchIdle: "text-muted-foreground hover:bg-muted hover:text-foreground",
  pillSearch:
    "h-8 w-full rounded-full border border-cosmate-lavender-border bg-muted/60 pl-7 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-cosmate-pink focus:bg-card focus:outline-none focus:ring-2 focus:ring-cosmate-pink/25",
  ghostIconBtn:
    "flex shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
  ghostIconDisabled: "text-muted-foreground/35",
  sendFab:
    "flex shrink-0 items-center justify-center rounded-full bg-cosmate-pink text-primary-foreground shadow-sm transition-colors hover:bg-cosmate-pink/90 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none",
  textarea:
    "max-h-24 flex-1 resize-none overflow-y-auto whitespace-pre-wrap wrap-break-word rounded-full border border-cosmate-lavender-border bg-muted/50 px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-cosmate-pink focus:bg-cosmate-soft-pink/30 focus:ring-2 focus:ring-cosmate-pink/20 disabled:cursor-not-allowed disabled:opacity-50",
  skeleton: "animate-pulse rounded-full bg-muted",
  sepLine: "h-px flex-1 bg-cosmate-lavender-border",
  dateLabel: "whitespace-nowrap px-2 text-[10px] font-medium text-muted-foreground",
  onlineDot: "bg-cosmate-pink",
  offlineDot: "bg-muted-foreground/45",
  mineBubble:
    "max-w-[80%] overflow-hidden rounded-2xl rounded-br-sm bg-[image:var(--gradient-chat-mine)] px-3 py-2 text-sm text-primary-foreground shadow-sm md:max-w-[75%]",
  theirBubble:
    "max-w-[80%] overflow-hidden rounded-2xl rounded-bl-sm border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm md:max-w-[75%]",
  timeOnMine: "text-primary-foreground/75",
  timeOnTheirs: "text-muted-foreground",
  bookingCta:
    "inline-flex items-center gap-1.5 rounded-full bg-cosmate-pink px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-cosmate-pink/90 disabled:opacity-50",
  spinner: "h-8 w-8 animate-spin rounded-full border-2 border-cosmate-lavender-border border-t-cosmate-pink",
} as const
