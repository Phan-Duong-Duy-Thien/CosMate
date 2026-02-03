import * as React from "react"

import { cn } from "@/lib/utils"

interface TabItem {
  key: string
  label: string
}

interface DetailTabsProps {
  tabs: TabItem[]
  activeKey: string
  onChange: (key: string) => void
  children: React.ReactNode
}

export const DetailTabs = ({
  tabs,
  activeKey,
  onChange,
  children,
}: DetailTabsProps) => (
  <section className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm">
    <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold",
            activeKey === tab.key
              ? "bg-pink-100 text-pink-700"
              : "bg-white text-slate-600"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
    <div className="mt-5">{children}</div>
  </section>
)
