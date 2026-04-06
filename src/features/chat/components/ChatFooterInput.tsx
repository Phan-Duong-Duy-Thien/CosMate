import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/shared/components/Button"
import { cn } from "@/lib/utils"

interface ChatFooterInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (content: string) => void
  disabled?: boolean
}

export function ChatFooterInput({ value, onChange, onSend, disabled }: ChatFooterInputProps) {
  const [focused, setFocused] = useState(false)

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    onChange("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div className={cn(
      "border-t border-slate-200 bg-white px-4 py-3 transition-all",
      focused && "bg-white"
    )}>
      <div className="mx-auto flex max-w-2xl items-center gap-2">
        <div className={cn(
          "flex flex-1 items-center gap-2 rounded-full border bg-white px-4 py-2 transition-all",
          focused ? "border-pink-300 bg-pink-50/30 shadow-sm" : "border-slate-200",
          disabled && "bg-slate-50 opacity-60"
        )}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Type a message..."
            disabled={disabled}
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <Button
          size="md"
          variant={canSend ? "default" : "ghost"}
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "shrink-0 rounded-full p-0! transition-all",
            canSend
              ? "h-10 w-10 bg-pink-400 text-white hover:bg-pink-500 active:scale-95"
              : "h-10 w-10 text-slate-300"
          )}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
