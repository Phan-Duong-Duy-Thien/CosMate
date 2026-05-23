/**
 * Chat UI — neo-brutal / home-anime shell (CosMate design system).
 * Pink accents + indigo-950 outlines + offset shadows; mine bubbles use --gradient-chat-mine.
 */
export const CHAT_UI = {
  /** Beside chat FAB: right-6 + 4rem button + 0.75rem gap */
  popupShell:
    "home-anime fixed bottom-6 right-[5.75rem] z-50 flex h-[min(500px,calc(100vh-3rem))] w-[min(460px,calc(100vw-6.5rem))] overflow-hidden rounded-[1.25rem] border-[4px] border-indigo-950 bg-[#fffbeb]/95 shadow-[8px_8px_0_0_rgba(30,27,75,0.32)]",
  panel:
    "home-anime overflow-hidden rounded-[1.25rem] border-[3px] border-indigo-950 bg-[#fffbeb] shadow-[6px_6px_0_0_rgba(30,27,75,0.28)]",
  providerShell:
    "home-anime flex h-[calc(100vh-180px)] overflow-hidden rounded-[1.25rem] border-[3px] border-indigo-950 bg-[#fffbeb] shadow-[6px_6px_0_0_rgba(30,27,75,0.28)]",
  pageCanvas:
    "home-anime min-h-0 bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)]",
  sidebar:
    "flex h-full shrink-0 flex-col bg-gradient-to-b from-cosmate-soft-pink/55 to-[#fffbeb]",
  sidebarCompact: "w-[140px]",
  sidebarComfortable: "min-w-0 w-72",
  sidebarBorder: "border-r-[3px] border-indigo-950",
  sidebarDivider: "border-b-[2px] border-indigo-950/15",
  sidebarHeader:
    "flex h-14 shrink-0 items-center justify-between border-b-[3px] border-indigo-950 bg-white/80",
  sidebarHeaderCompact: "px-2",
  sidebarHeaderComfortable: "px-4",
  sidebarSearchPadCompact: "p-2",
  sidebarSearchPadComfortable: "p-3",
  headerBar:
    "flex shrink-0 items-center border-b-[3px] border-indigo-950 bg-white/90",
  popupHeader:
    "flex shrink-0 items-center justify-between border-b-[3px] border-indigo-950 bg-white/90 px-4 py-3",
  partnerTitle: "truncate text-sm font-extrabold leading-tight text-indigo-950",
  partnerStatus: "truncate text-xs font-semibold text-indigo-900/65",
  closeIconBtn:
    "ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-indigo-950 bg-white text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b] transition hover:-translate-y-0.5 hover:bg-cosmate-soft-pink/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300",
  messageEmpty:
    "flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-cosmate-soft-pink/25 to-transparent text-indigo-900/70",
  messageScroll:
    "flex h-full flex-1 flex-col overflow-y-auto bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_40%,#fffbeb_100%)]",
  messageScrollPad: "px-3 py-3",
  footerBar:
    "flex shrink-0 items-start gap-2 border-t-[3px] border-indigo-950 bg-[#fffbeb]",
  avatarRing: "ring-2 ring-indigo-950 shadow-[2px_2px_0_0_rgba(30,27,75,0.2)]",
  avatarFallback:
    "flex shrink-0 items-center justify-center rounded-full border-2 border-indigo-950/30 bg-gradient-to-br from-cosmate-soft-pink to-cosmate-lavender-surface text-[10px] font-extrabold text-cosmate-pink md:text-xs",
  searchActive:
    "border-2 border-indigo-950 bg-cosmate-soft-pink text-cosmate-pink shadow-[2px_2px_0_0_#1e1b4b]",
  searchIdle:
    "border-2 border-transparent text-indigo-900/70 hover:border-indigo-950/25 hover:bg-white/90 hover:text-indigo-950",
  pillSearch:
    "h-8 w-full rounded-xl border-[2px] border-indigo-950 bg-white pl-7 pr-3 text-xs font-medium text-indigo-950 placeholder:text-indigo-900/45 focus:border-cosmate-pink focus:outline-none focus:ring-4 focus:ring-pink-300/40",
  ghostIconBtn:
    "flex shrink-0 items-center justify-center rounded-xl border-2 border-indigo-950/40 bg-white text-indigo-950 transition hover:-translate-y-0.5 hover:border-indigo-950 hover:bg-cosmate-soft-pink/40 hover:shadow-[2px_2px_0_0_#1e1b4b]",
  ghostIconDisabled: "border-transparent bg-transparent text-indigo-900/30 shadow-none",
  sendFab:
    "flex shrink-0 items-center justify-center rounded-xl border-2 border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-[3px_3px_0_0_#1e1b4b] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#1e1b4b] disabled:border-indigo-950/20 disabled:bg-indigo-100 disabled:text-indigo-900/40 disabled:shadow-none",
  textarea:
    "max-h-24 flex-1 resize-none overflow-y-auto whitespace-pre-wrap wrap-break-word rounded-xl border-[2px] border-indigo-950 bg-white px-4 py-2 text-sm font-medium text-indigo-950 outline-none placeholder:text-indigo-900/45 focus:border-cosmate-pink focus:bg-cosmate-soft-pink/20 focus:ring-4 focus:ring-pink-300/35 disabled:cursor-not-allowed disabled:opacity-50",
  skeleton: "animate-pulse rounded-full border border-indigo-950/10 bg-cosmate-soft-pink/50",
  sepLine: "h-[2px] flex-1 rounded-full bg-indigo-950/12",
  dateLabel:
    "whitespace-nowrap px-2 text-[10px] font-extrabold uppercase tracking-wide text-indigo-900/55",
  onlineDot: "bg-cosmate-success",
  offlineDot: "bg-indigo-900/35",
  mineBubble:
    "max-w-[80%] overflow-hidden rounded-2xl rounded-br-md border-2 border-indigo-950/80 bg-[image:var(--gradient-chat-mine)] px-3 py-2 text-sm font-medium text-white shadow-[3px_3px_0_0_rgba(30,27,75,0.22)] md:max-w-[75%]",
  theirBubble:
    "max-w-[80%] overflow-hidden rounded-2xl rounded-bl-md border-[2px] border-indigo-950 bg-white px-3 py-2 text-sm font-medium text-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,0.15)] md:max-w-[75%]",
  timeOnMine: "font-semibold text-white/80",
  timeOnTheirs: "font-semibold text-indigo-900/50",
  bookingCta:
    "inline-flex items-center gap-1.5 rounded-xl border-2 border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-[3px_3px_0_0_#1e1b4b] transition hover:-translate-y-0.5 disabled:opacity-50",
  spinner:
    "h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-950/20 border-t-cosmate-pink",
  roomRow:
    "group/sidebar-btn flex w-full items-center gap-2 overflow-hidden rounded-xl border-2 border-transparent px-2 py-2 text-left transition-all",
  roomRowActive:
    "border-indigo-950 bg-gradient-to-br from-pink-200/95 to-amber-50 shadow-[3px_3px_0_0_#1e1b4b]",
  roomRowHover: "hover:border-indigo-950/35 hover:bg-white/90",
  roomNameActive: "font-extrabold text-indigo-950",
  roomNameIdle: "font-bold text-indigo-950",
  roomTime: "block truncate text-[10px] font-semibold leading-tight text-indigo-900/50",
  userRowHover:
    "hover:border-indigo-950/30 hover:bg-gradient-to-r hover:from-cosmate-soft-pink/50 hover:to-white",
  emptyInbox:
    "flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-indigo-900/60",
  emptyIcon: "text-cosmate-pink/50",
  emptyTitle: "text-sm font-extrabold text-indigo-950",
  emptySubtitle: "text-xs font-semibold text-indigo-900/60",
  tooltip:
    "pointer-events-none absolute bottom-full left-0 z-[60] mb-1.5 max-w-[min(16rem,100%)] whitespace-nowrap rounded-xl border-2 border-indigo-950 bg-[#fffbeb] px-2.5 py-1.5 text-xs font-semibold text-indigo-950 opacity-0 shadow-[4px_4px_0_0_#1e1b4b] transition-opacity group-hover/sidebar-btn:opacity-100",
  tooltipArrow:
    "absolute bottom-0 left-3 h-1.5 w-1.5 translate-y-full rotate-45 border-b-2 border-r-2 border-indigo-950 bg-[#fffbeb]",
  tooltipSub: "block font-medium text-indigo-900/55",
  avatarSm: "h-8 w-8 shrink-0 rounded-full border-2 border-indigo-950/25 object-cover",
  avatarMd: "h-9 w-9 rounded-full border-2 border-indigo-950/25 object-cover",
  avatarFallbackSm:
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-indigo-950/25 bg-gradient-to-br from-cosmate-soft-pink to-cosmate-lavender-surface text-[10px] font-extrabold text-cosmate-pink",
  avatarFallbackMd:
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-indigo-950/25 bg-gradient-to-br from-cosmate-soft-pink to-cosmate-lavender-surface text-xs font-extrabold text-cosmate-pink",
  statusDot: "absolute bottom-0 right-0 rounded-full border-2 border-white",
  statusDotSm: "h-2.5 w-2.5",
  imageInBubble:
    "block max-h-[250px] max-w-[200px] cursor-pointer rounded-lg border-2 border-indigo-950/40 object-cover",
  footerBarPopup:
    "flex h-[60px] shrink-0 items-start gap-2 border-t-[3px] border-indigo-950 bg-[#fffbeb] px-3 py-2",
  iconBtnSm:
    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
  sidebarFooterBtn:
    "flex w-full items-center justify-center gap-1 rounded-xl border-2 border-indigo-950/30 bg-white py-2 text-xs font-bold text-indigo-900/70 transition hover:border-indigo-950 hover:bg-cosmate-soft-pink/40 hover:text-indigo-950",
} as const
