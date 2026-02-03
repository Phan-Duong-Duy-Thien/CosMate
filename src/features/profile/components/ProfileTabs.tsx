import type { ReactNode } from "react"
import type { ProfileTabId } from "../types"
import { cn } from "@/lib/utils"

const TAB_LABELS: Record<ProfileTabId, string> = {
  gallery: "My Gallery",
  concepts: "Favorite Concepts",
  reviews: "Reviews",
}

interface ProfileTabsProps {
  activeTab: ProfileTabId
  onTabChange: (tab: ProfileTabId) => void
  children: ReactNode
}

export function ProfileTabs({
  activeTab,
  onTabChange,
  children,
}: ProfileTabsProps) {
  const tabs: ProfileTabId[] = ["gallery", "concepts", "reviews"]
  return (
    <div className="min-w-0 flex-1">
      <div className="flex gap-10 border-b border-slate-200 px-4 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn(
              "relative py-6 text-sm font-bold transition-colors",
              activeTab === tab
                ? "text-purple-800"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            {TAB_LABELS[tab]}
            {activeTab === tab && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t bg-purple-500 transition-all duration-200 ease-out"
                aria-hidden
              />
            )}
          </button>
        ))}
      </div>
      <div className="py-6">{children}</div>
    </div>
  )
}
