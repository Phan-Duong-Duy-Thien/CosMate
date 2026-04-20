import { useState } from "react"
import { cn } from "@/lib/utils"
import { formatChatTime } from "@/lib/datetime"
import { resolveImageUrl } from "@/constants/images"
import type { ChatMessage } from "../types"

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

export function ChatMessageBubble({ message, isMine }: ChatMessageBubbleProps) {
  const time = formatChatTime(message.createdAt ?? "")
  const [previewOpen, setPreviewOpen] = useState(false)

  // Also detect IMAGE from URL content in case server doesn't broadcast messageType
  const isImageMessage = message.messageType === "IMAGE" || (message.content ?? "").startsWith("http")

  const imageSrc = resolveImageUrl(message.content ?? "")

  if (isImageMessage) {
    console.log("[ChatMessageBubble] IMAGE:", { content: message.content, resolved: imageSrc })

    return (
      <>
        <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
          <div
            className={cn(
              "group relative max-w-[70%] overflow-hidden rounded-xl shadow-sm transition-all",
              isMine ? "rounded-br-sm" : "rounded-bl-sm border border-slate-200",
              isMine ? {} : { background: "white" }
            )}
          >
            <img
              src={imageSrc}
              alt="Shared image"
              className="block w-full cursor-pointer object-cover transition-opacity hover:opacity-90"
              style={{ maxHeight: "300px", maxWidth: "250px" }}
              onClick={(e) => { e.stopPropagation(); setPreviewOpen(true) }}
              onError={(e) => {
                console.error("[ChatMessageBubble] Image load failed:", imageSrc)
                e.currentTarget.style.display = "none"
              }}
            />
            <p
              className={cn(
                "px-2 pb-1 text-[10px]",
                isMine ? "text-right text-pink-200" : "text-slate-400"
              )}
            >
              {time}
            </p>
          </div>
        </div>

        {previewOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewOpen(false)}
          >
            {/* Close button */}
            <button
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              onClick={() => setPreviewOpen(false)}
            >
              <svg className="h-5 w-5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>

            <img
              src={imageSrc}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    )
  }

  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "group relative max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all overflow-hidden",
          isMine
            ? "rounded-br-sm bg-linear-to-br from-pink-400 to-pink-500 text-white"
            : "rounded-bl-sm border border-slate-100 bg-white text-slate-700"
        )}
      >
        <p className="whitespace-pre-wrap wrap-break-word leading-relaxed">{message.content}</p>
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-[10px]",
            isMine ? "justify-end text-pink-200" : "text-slate-400"
          )}
        >
          {!isMine && (
            <svg className="h-3 w-3 text-pink-300 opacity-0 transition-opacity group-hover:opacity-100" viewBox="0 0 12 12" fill="currentColor">
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
            </svg>
          )}
          {time}
        </p>
      </div>
    </div>
  )
}
