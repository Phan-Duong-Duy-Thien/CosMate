import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"

export type LoginMethod = "email" | "qr"

type LoginMethodTabsProps = {
  value: LoginMethod
  onChange: (method: LoginMethod) => void
  disabled?: boolean
}

export function LoginMethodTabs({ value, onChange, disabled }: LoginMethodTabsProps) {
  const tabs: { id: LoginMethod; label: string }[] = [
    { id: "email", label: VI.auth.login.methodEmail },
    { id: "qr", label: VI.auth.login.methodQr },
  ]

  return (
    <div
      className="grid grid-cols-2 gap-2 rounded-2xl border-[3px] border-indigo-950 bg-white p-1.5 shadow-[4px_4px_0_0_rgba(30,27,75,0.12)]"
      role="tablist"
      aria-label={VI.auth.login.methodTabsLabel}
    >
      {tabs.map((tab) => {
        const selected = value === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-xl px-3 py-2.5 text-sm font-extrabold transition-all",
              "border-2 border-transparent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink focus-visible:ring-offset-2",
              selected
                ? "border-indigo-950 bg-cosmate-soft-pink/60 text-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,0.2)]"
                : "text-indigo-900/60 hover:bg-[#fffbeb]/80 hover:text-indigo-950",
              disabled && "pointer-events-none opacity-50"
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
