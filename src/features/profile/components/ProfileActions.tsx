import { Button } from "@/components/ui/button"
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
        className={buttonBase}
        onClick={onEditProfile}
      >
        Edit Profile
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn("text-muted-foreground", buttonBase)}
        onClick={onLogout}
      >
        Logout
      </Button>
    </div>
  )
}
