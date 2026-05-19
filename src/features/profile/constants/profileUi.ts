/**
 * UI token cho profile modals trên cosplayer shell (home-anime).
 * Neo outline + offset shadow — khớp ProfileCover / cards trên /profile.
 */
export const PROFILE_MODAL_UI = {
  content:
    "max-h-[85vh] max-w-xl overflow-y-auto rounded-[1.5rem] border-[3px] border-indigo-950 bg-[#fffaf0] p-6 shadow-[10px_10px_0_0_rgba(30,27,75,0.3)]",
  title: "pr-10 text-xl font-extrabold tracking-tight text-indigo-950",
  closeBtn:
    "absolute right-4 top-4 rounded-full border-2 border-indigo-950/25 bg-white p-2 text-indigo-900 transition-all hover:-translate-y-0.5 hover:bg-cosmate-soft-pink/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/40",
  tabTrack:
    "flex gap-2 rounded-xl border-2 border-indigo-950/20 bg-white/80 p-1 shadow-[3px_3px_0_0_rgba(30,27,75,0.1)]",
  tabBtn: "flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-all",
  tabActive:
    "bg-cosmate-soft-pink text-indigo-950 shadow-[2px_2px_0_0_rgba(30,27,75,0.18)]",
  tabIdle:
    "text-indigo-900/55 hover:bg-cosmate-soft-pink/35 hover:text-indigo-950",
  section:
    "rounded-2xl border-2 border-indigo-950/25 bg-white/95 p-4 shadow-[4px_4px_0_0_rgba(30,27,75,0.12)]",
  sectionTitle: "text-sm font-bold text-indigo-950",
  label: "mb-1 block text-sm font-bold text-indigo-950",
  required: "text-[#d61f91]",
  fieldError: "mt-1 text-xs font-semibold text-destructive",
  input:
    "h-10 w-full rounded-full border-2 border-indigo-950/35 bg-white px-4 text-sm font-medium text-indigo-950 shadow-sm placeholder:text-indigo-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/45 focus-visible:ring-offset-0",
  inputError: "!border-destructive focus-visible:ring-destructive/35",
  select:
    "h-10 w-full rounded-full border-2 border-indigo-950/35 bg-white px-4 text-sm font-medium text-indigo-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/45 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
  avatar:
    "h-16 w-16 rounded-full border-[3px] border-indigo-950 object-cover bg-white shadow-[3px_3px_0_0_rgba(30,27,75,0.2)]",
  avatarFallback:
    "flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-indigo-950 bg-cosmate-soft-pink text-lg font-extrabold text-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,0.2)]",
  fileInput:
    "block w-full text-sm font-medium text-indigo-900/70 file:mr-3 file:rounded-full file:border-2 file:border-indigo-950 file:bg-cosmate-soft-pink file:px-3 file:py-2 file:text-sm file:font-bold file:text-indigo-950 hover:file:bg-cosmate-pink/25",
  addressCard:
    "rounded-xl border-2 border-indigo-950/25 bg-white p-3 shadow-[3px_3px_0_0_rgba(30,27,75,0.1)]",
  addressName: "text-sm font-bold text-indigo-950",
  addressMeta: "mt-0.5 text-sm font-semibold text-indigo-900/65",
  alertError:
    "rounded-xl border-2 border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive shadow-[2px_2px_0_0_rgba(30,27,75,0.08)]",
  alertSuccess:
    "rounded-xl border-2 border-emerald-600/35 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-800",
  mutedText: "text-sm font-medium text-indigo-900/60",
  deleteBtn:
    "border-2 border-destructive/40 bg-destructive/10 font-bold text-destructive shadow-[2px_2px_0_0_rgba(30,27,75,0.1)] hover:bg-destructive/15",
  footerActions: "flex justify-end gap-3 pt-2",
  btnCancel:
    "h-9 rounded-xl border-2 border-indigo-950 bg-white px-4 text-sm font-bold text-indigo-900 shadow-[3px_3px_0_0_rgba(30,27,75,0.22)] transition-all hover:-translate-y-0.5 hover:bg-cosmate-soft-pink/50 active:scale-[0.98]",
  btnPrimary:
    "h-9 rounded-xl border-[3px] border-indigo-950 bg-cosmate-soft-pink px-4 text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0_0_rgba(30,27,75,0.28)] transition-all hover:-translate-y-0.5 hover:bg-cosmate-pink/30 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none",
  btnGhost:
    "h-9 rounded-xl border-2 border-indigo-950/30 bg-white px-3 text-sm font-bold text-indigo-900 shadow-[2px_2px_0_0_rgba(30,27,75,0.12)] hover:-translate-y-0.5 hover:bg-cosmate-soft-pink/40",
  cropContent:
    "max-w-2xl rounded-[1.5rem] border-[3px] border-indigo-950 bg-[#fffaf0] p-6 shadow-[10px_10px_0_0_rgba(30,27,75,0.3)]",
  cropPreview:
    "overflow-hidden rounded-2xl border-2 border-indigo-950/30 bg-black shadow-[4px_4px_0_0_rgba(30,27,75,0.2)]",
  cropTitle: "text-lg font-extrabold tracking-tight text-indigo-950",
  rangeInput: "w-full accent-[#d61f91]",
} as const

/** Neo stat/section cards on cosplayer `/profile` */
export const PROFILE_CARD_UI = {
  card:
    "rounded-2xl border-[3px] border-indigo-950/20 bg-white/85 shadow-[5px_5px_0_0_rgba(30,27,75,0.14)]",
  cardHover:
    "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_rgba(30,27,75,0.2)]",
  inner: "flex flex-col p-5",
  title: "text-base font-extrabold text-indigo-950",
  iconBox:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[2px] border-indigo-950 bg-cosmate-soft-pink/60 shadow-[3px_3px_0_0_rgba(30,27,75,0.18)]",
  iconGlyph: "h-5 w-5 text-[#d61f91]",
  body: "mt-1 min-h-0 flex-1",
  footer: "mt-4 flex flex-wrap items-center justify-end gap-2",
  label: "text-sm font-medium text-slate-500",
  value: "mt-2 text-2xl font-extrabold text-[#d61f91]",
  action:
    "rounded-xl border-[2px] border-indigo-950 bg-white font-bold text-indigo-900 hover:bg-pink-50",
  linkAction:
    "text-sm font-bold text-[#d61f91] underline-offset-2 transition-colors hover:text-[#b0177a] hover:underline",
} as const
