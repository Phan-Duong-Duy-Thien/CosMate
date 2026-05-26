import { useCallback, useEffect, useMemo, useState } from "react"
import { Upload, notification } from "antd"
import type { UploadFile, UploadProps } from "antd"
import { Camera, Loader2, Search, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAISearch, type AISearchResultItem } from "@/features/search/hooks/useAISearch"

interface AISearchBarProps {
  onSearchCompleted?: (results: AISearchResultItem[]) => void
}

const promptSuggestions = [
  "Naruto hokage",
  "Luffy",
  "Goku",
  "Kimono hồng pastel",
  "Áo choàng đỏ",
]

export default function AISearchBar({ onSearchCompleted }: AISearchBarProps) {
  const { executeSearch, isLoading, fallbackUsed } = useAISearch()

  const [keyword, setKeyword] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadList, setUploadList] = useState<UploadFile[]>([])

  const hasEnoughInput = Boolean(selectedFile || keyword.trim())

  const previewUrl = useMemo(() => {
    const file = uploadList[0]?.originFileObj
    return file ? URL.createObjectURL(file) : null
  }, [uploadList])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const resetState = () => {
    setKeyword("")
    setSelectedFile(null)
    setUploadList([])
  }

  const clearImage = () => {
    setSelectedFile(null)
    setUploadList([])
  }

  const handleUploadChange: UploadProps["onChange"] = useCallback(
    (info: Parameters<NonNullable<UploadProps["onChange"]>>[0]) => {
      const normalized = info.fileList.slice(-1)
      setUploadList(normalized)
      const latestFile = normalized[0]?.originFileObj
      setSelectedFile(latestFile ?? null)
    },
    []
  )

  const handleSubmit = async () => {
    if (!hasEnoughInput) {
      notification.warning({
        message: "Vui lòng nhập text hoặc tải ảnh để tìm kiếm.",
      })
      return
    }

    const result = await executeSearch({
      files: selectedFile ? [selectedFile] : [],
      text: keyword.trim(),
    })

    if (result) {
      onSearchCompleted?.(result)
      notification.success({
        message: fallbackUsed
          ? "Đã hiển thị kết quả tìm kiếm thông thường."
          : `Đã tìm thấy ${result.length} trang phục phù hợp!`,
      })
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] p-5 shadow-[10px_10px_0_0_rgba(30,27,75,0.22)] md:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cosmate-soft-pink/35 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-cosmate-lavender-surface/50 blur-3xl"
      />

      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,260px)] lg:items-start lg:gap-8">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border-[3px] border-indigo-950 bg-gradient-to-r from-cosmate-soft-pink/90 to-cosmate-lavender-surface px-3 py-1.5 shadow-[3px_3px_0_0_rgba(30,27,75,0.2)]">
            <Sparkles className="h-4 w-4 shrink-0 text-cosmate-pink" aria-hidden />
            <span className="text-[11px] font-extrabold uppercase leading-tight tracking-wide text-indigo-950 md:text-xs">
              Tính năng nổi bật: AI Costume Finder
            </span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-cosmate-pink md:text-2xl">
              Tìm trang phục cosplay bằng ảnh + text đồng thời
            </h3>
            <p className="mt-1.5 text-sm font-semibold leading-relaxed text-indigo-950/80">
              Bạn có thể upload ảnh, nhập mô tả, hoặc dùng cả hai để AI tìm chính xác hơn.
            </p>
          </div>

          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cosmate-mauve"
              aria-hidden
            />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tên nhân vật, đặc điểm bộ đồ, phụ kiện, tóc, ..."
              className="h-12 w-full rounded-xl border-[3px] border-indigo-950 bg-white pl-11 pr-3 text-sm font-semibold text-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,0.12)] placeholder:text-indigo-900/40 focus:border-cosmate-pink/80 focus:outline-none focus:ring-2 focus:ring-cosmate-pink/25"
              autoComplete="off"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setKeyword(prompt)}
                className="rounded-full border-[2px] border-indigo-950/25 bg-white px-3 py-1.5 text-xs font-bold text-indigo-950 shadow-[2px_2px_0_0_rgba(30,27,75,0.12)] transition hover:-translate-y-0.5 hover:border-indigo-950/40 hover:bg-cosmate-soft-pink/35"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              type="button"
              size="lg"
              disabled={!hasEnoughInput || isLoading}
              onClick={handleSubmit}
              className="h-12 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 px-6 font-extrabold text-white shadow-[5px_5px_0_0_#1e1b4b] hover:brightness-110 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
              ) : (
                <Camera className="h-5 w-5 shrink-0" aria-hidden />
              )}
              Tìm trang phục bằng AI
            </Button>

            <Button
              type="button"
              variant="cosmateOutline"
              size="lg"
              disabled={(!uploadList.length && !keyword) || isLoading}
              onClick={resetState}
              className="h-12 rounded-xl border-[3px] border-indigo-950/30 bg-white font-extrabold text-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,0.12)] hover:bg-cosmate-soft-pink/25"
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3 lg:pt-1">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-indigo-900/55">
            Ảnh tham chiếu
          </p>

          <Upload
            accept="image/*"
            maxCount={1}
            fileList={uploadList}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            showUploadList={false}
            disabled={isLoading}
            className="block w-full [&_.ant-upload]:block [&_.ant-upload]:w-full"
          >
            <div
              role="button"
              tabIndex={0}
              className={cn(
                "group relative flex aspect-square w-full max-w-[260px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-[3px] border-dashed border-indigo-950/35 bg-white shadow-[4px_4px_0_0_rgba(30,27,75,0.15)] transition",
                "hover:border-cosmate-pink/60 hover:bg-cosmate-soft-pink/20",
                isLoading && "cursor-not-allowed opacity-60"
              )}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Ảnh tham chiếu đã chọn" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      clearImage()
                    }}
                    className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-white/95 text-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,0.25)] transition hover:bg-rose-50"
                    aria-label="Xóa ảnh đã chọn"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Camera className="h-10 w-10 text-cosmate-pink" aria-hidden />
                  <span className="px-2 text-center text-xs font-extrabold text-indigo-950">Tải ảnh cosplay</span>
                </>
              )}
            </div>
          </Upload>

          <div className="flex min-h-[2.75rem] items-center justify-between gap-2 rounded-xl border-[3px] border-indigo-950/15 bg-cosmate-soft-pink/30 px-3 py-2 text-xs font-semibold text-indigo-950/85">
            <span className="line-clamp-2 break-all">
              {uploadList[0]?.name ?? "Chưa có ảnh nào được chọn"}
            </span>
          </div>
        </div>
      </div>

      {isLoading && (
        <p className="relative mt-4 border-t-2 border-indigo-950/10 pt-3 text-center text-sm font-bold text-cosmate-pink">
          Bé Mèo AI đang tìm trang phục phù hợp…
        </p>
      )}
    </div>
  )
}
