import { Button } from "@/shared/components/Button"
import { cn } from "@/lib/utils"

interface ProfileActionsProps {
  onEditProfile: () => void
  onLogout: () => void
  className?: string
}

const buttonBase =
  "cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"

export function ProfileActions({
  onEditProfile,
  onLogout,
  className,
}: ProfileActionsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        variant="default"
        size="sm"
        className={cn(
          "rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[4px_4px_0_0_#1e1b4b]",
          buttonBase
        )}
        onClick={onEditProfile}
      >
        Edit Profile
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-xl border-[3px] border-indigo-950/40 bg-[#fffbeb] font-extrabold text-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,0.2)]",
          buttonBase
        )}
        onClick={onLogout}
      >
        Logout
      </Button>
    </div>
  )
}
