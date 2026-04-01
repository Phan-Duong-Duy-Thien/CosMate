import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/shared/components/Button"
import { Input } from "@/shared/components/Input"

interface ChatFooterProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatFooter({ onSend, disabled }: ChatFooterProps) {
  const [value, setValue] = useState("")

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nhập tin nhắn..."
        disabled={disabled}
        className="flex-1 rounded-full"
      />
      <Button
        size="md"
        variant="default"
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="rounded-full px-4 aspect-square !p-0"
        aria-label="Gửi tin nhắn"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
