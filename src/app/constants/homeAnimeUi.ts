/**
 * UI token cho cosplayer shell (home-anime): header, neo outline, offset shadow.
 */
export const SITE_HEADER_UI = {
  shell:
    "fixed left-0 top-0 z-[9999] w-full border-b-[3px] border-indigo-950 bg-[#fffaf0]/95 backdrop-blur-md transition-shadow",
  shellScrolled: "shadow-[0_5px_0_0_rgba(30,27,75,0.24)]",
  inner: "flex h-20 w-full items-center gap-4 pl-0 pr-5 md:h-[4.75rem] md:gap-5 md:pr-6",
  mainOffset: "pt-20 md:pt-[4.75rem]",
  logoLink:
    "ml-4 inline-flex shrink-0 items-center rounded-xl border-2 border-transparent p-1 transition-all hover:border-indigo-950/25 hover:bg-cosmate-soft-pink/40 md:ml-6",
  logoImg: "h-11 w-auto object-contain md:h-12",
  nav: "hidden flex-1 items-center justify-center gap-1 whitespace-nowrap md:flex lg:gap-2",
  navBtn:
    "rounded-full border-2 p-3 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/40",
  navIcon: "h-6 w-6 md:h-[1.35rem] md:w-[1.35rem]",
  navBtnActive:
    "border-indigo-950/30 bg-cosmate-soft-pink text-cosmate-pink shadow-[2px_2px_0_0_rgba(30,27,75,0.18)]",
  navBtnIdle:
    "border-transparent text-indigo-950/70 hover:border-indigo-950/15 hover:bg-cosmate-soft-pink/45 hover:text-cosmate-pink",
  actions: "ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2",
  iconBtn:
    "relative rounded-full border-2 border-transparent p-2.5 text-indigo-900/70 transition-all hover:-translate-y-0.5 hover:border-indigo-950/20 hover:bg-cosmate-soft-pink/50 hover:text-cosmate-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/40",
  actionIcon: "h-6 w-6 md:h-[1.35rem] md:w-[1.35rem]",
  unreadBadge:
    "absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-indigo-950/40 bg-cosmate-pink text-[9px] font-bold text-white shadow-[1px_1px_0_0_rgba(30,27,75,0.35)]",
  cartDot: "absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-indigo-950/30 bg-cosmate-pink",
  avatarWrap:
    "inline-flex cursor-pointer rounded-full outline-none transition-transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus-visible:outline-none",
  avatar:
    "!rounded-full !border-[2.5px] !border-indigo-950 !shadow-[2px_2px_0_0_rgba(30,27,75,0.22)]",
  authLogin:
    "h-10! rounded-xl! border-2! border-indigo-950! bg-white! px-5! text-sm! font-bold! text-indigo-900! shadow-[3px_3px_0_0_rgba(30,27,75,0.22)]! hover:-translate-y-0.5! hover:bg-cosmate-soft-pink/50! hover:text-indigo-950!",
  authRegister:
    "h-10! rounded-xl! border-[3px]! border-indigo-950! bg-cosmate-soft-pink! px-5! text-sm! font-extrabold! text-indigo-950! shadow-[4px_4px_0_0_rgba(30,27,75,0.28)]! hover:-translate-y-0.5! hover:bg-cosmate-pink/30!",
  searchWrap: "hidden min-w-[220px] md:flex lg:min-w-[280px]",
  searchInput:
    "h-10! w-full! min-w-[220px]! rounded-full! border-2! border-indigo-950/35! bg-white! pl-10! pr-9! text-sm! font-medium! text-indigo-950! shadow-[2px_2px_0_0_rgba(30,27,75,0.1)]! placeholder:text-indigo-900/40! focus-visible:ring-2! focus-visible:ring-cosmate-pink/40! lg:min-w-[280px]!",
  searchIcon: "absolute left-3 z-10 text-indigo-900/45",
  searchDropdown:
    "absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border-2 border-indigo-950/30 bg-[#fffaf0] shadow-[6px_6px_0_0_rgba(30,27,75,0.22)]",
} as const

/** Header notification popover (neo-brutal, matches NotificationsPage cards) */
export const NOTIFICATION_POPOVER_UI = {
  shell:
    "home-anime w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-[1.25rem] border-[3px] border-indigo-950 bg-[#fffbeb] shadow-[8px_8px_0_0_rgba(30,27,75,0.32)]",
  header:
    "flex items-center justify-between gap-2 border-b-[3px] border-indigo-950 bg-white/90 px-4 py-3",
  title: "m-0 text-sm font-extrabold text-indigo-950",
  markAllBtn:
    "shrink-0 rounded-lg border-2 border-indigo-950/25 bg-white px-2 py-1 text-xs font-extrabold text-cosmate-pink shadow-[2px_2px_0_0_#1e1b4b] transition hover:-translate-y-0.5 hover:border-indigo-950 hover:bg-cosmate-soft-pink/50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300",
  list: "max-h-[360px] overflow-y-auto bg-[linear-gradient(180deg,#fff7fb_0%,#fffbeb_100%)]",
  empty: "p-8 text-center text-sm font-semibold text-indigo-900/55",
  item:
    "cursor-pointer border-b-2 border-indigo-950/10 px-4 py-3 transition-all last:border-b-0 hover:-translate-y-px hover:bg-cosmate-soft-pink/45",
  itemUnread: "bg-gradient-to-r from-pink-50/90 to-[#fffbeb]",
  itemHeaderRead: "m-0 text-sm font-semibold leading-snug text-indigo-900/70",
  itemHeaderUnread: "m-0 text-sm font-extrabold leading-snug text-indigo-950",
  itemContent: "mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-indigo-900/55",
  deleteBtn:
    "shrink-0 rounded-lg border-2 border-indigo-950 bg-[#fffbeb] p-1.5 text-indigo-950 shadow-[2px_2px_0_0_#1e1b4b] transition hover:-translate-y-0.5 hover:border-indigo-950 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300",
  footer:
    "cursor-pointer border-t-[3px] border-indigo-950 bg-gradient-to-r from-pink-100/80 to-fuchsia-100/50 px-4 py-3 text-center text-sm font-extrabold text-cosmate-pink transition hover:bg-cosmate-soft-pink/60",
  unreadDot:
    "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-indigo-950 bg-gradient-to-br from-pink-500 to-fuchsia-600 shadow-[1px_1px_0_0_#1e1b4b]",
  readDot: "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-indigo-950/25 bg-slate-300",
} as const
