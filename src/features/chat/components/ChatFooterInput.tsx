import { useState, useRef } from "react"
import { Send, Image } from "lucide-react"
import { Button } from "@/shared/components/Button"
import { cn } from "@/lib/utils"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

interface ChatFooterInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (content: string) => void
  onSendImage?: (file: File) => Promise<void>
  disabled?: boolean
  isUploading?: boolean
}

export function ChatFooterInput({ value, onChange, onSend, onSendImage, disabled, isUploading }: ChatFooterInputProps) {
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const autoResize = () => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    autoResize()
  }

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    onChange("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log("[SEND IMAGE]", file)

    if (!file.type.startsWith("image/")) {
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return
    }

    if (onSendImage) {
      await onSendImage(file)
    }

    // Reset input
    e.target.value = ""
  }

  const canSend = value.trim().length > 0 && !disabled
  const canSendImage = onSendImage && !disabled && !isUploading

  return (
    <div className={cn(
      "border-t border-slate-200 bg-white px-4 py-3 transition-all",
      focused && "bg-white"
    )}>
      <div className="mx-auto flex max-w-2xl items-center gap-2">
        <div className={cn(
          "flex flex-1 items-center gap-2 rounded-2xl border bg-white px-4 py-2 transition-all",
          focused ? "border-pink-300 bg-pink-50/30 shadow-sm" : "border-slate-200",
          disabled && "bg-slate-50 opacity-60"
        )}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 whitespace-pre-wrap wrap-break-word overflow-y-auto"
            style={{ maxHeight: "120px" }}
          />
        </div>

        {onSendImage && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            <Button
              size="md"
              variant={canSendImage ? "ghost" : "ghost"}
              onClick={() => fileInputRef.current?.click()}
              disabled={!canSendImage}
              className={cn(
                "shrink-0 rounded-full p-0! transition-all",
                canSendImage
                  ? "h-10 w-10 text-slate-500 hover:bg-slate-100 active:scale-95"
                  : "h-10 w-10 text-slate-300"
              )}
              aria-label="Send image"
            >
              <Image className="h-4 w-4" />
            </Button>
          </>
        )}

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
