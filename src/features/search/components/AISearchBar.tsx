import { useCallback, useMemo, useState } from "react"
import {
  CameraOutlined,
  DeleteOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons"
import { Button, Input, Upload, notification } from "antd"
import type { UploadFile, UploadProps } from "antd"

import AILoadingMascot from "@/shared/components/AILoadingMascot"
import { useAISearch, type AISearchResultItem } from "@/features/search/hooks/useAISearch"

interface AISearchBarProps {
  onSearchCompleted?: (results: AISearchResultItem[]) => void
}

const promptSuggestions = [
  "Naruto hokage",
  "Luffy",
  "Goku",
  "Kimono hồng pastel",
  "Áo choàng đỏ"
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

  const resetState = () => {
    setKeyword("")
    setSelectedFile(null)
    setUploadList([])
  }

  const handleUploadChange: UploadProps["onChange"] = useCallback((info: Parameters<NonNullable<UploadProps["onChange"]>>[0]) => {
    const normalized = info.fileList.slice(-1)
    setUploadList(normalized)
    const latestFile = normalized[0]?.originFileObj
    setSelectedFile(latestFile ?? null)
  }, [])

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
        message: fallbackUsed ? "Đã hiển thị kết quả tìm kiếm thông thường." : `Đã tìm thấy ${result.length} trang phục phù hợp!`,
      })
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-pink-200 bg-gradient-to-br from-white via-pink-50 to-rose-100 p-4 shadow-[0_12px_32px_rgba(236,72,153,0.15)] md:p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-pink-200/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-rose-200/40 blur-2xl" />

      <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-stretch">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-3 py-1 text-xs font-semibold text-pink-700">
            <ThunderboltOutlined />
            Tính năng nổi bật: AI Costume Finder
          </div>

          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-pink-700 md:text-2xl">
              Tìm trang phục cosplay bằng ảnh + text đồng thời
            </h3>
            <p className="mt-1 text-sm text-pink-900/75">
              Bạn có thể upload ảnh, nhập mô tả, hoặc dùng cả hai để AI tìm chính xác hơn.
            </p>
          </div>

          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tên nhân vật, đặc điểm bộ đồ, phụ kiện, tóc, ..."
            className="!h-11 !rounded-2xl border-pink-200 bg-white/90"
            prefix={<SearchOutlined className="text-pink-400" />}
          />

          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setKeyword(prompt)}
                className="rounded-full border border-pink-200 bg-white/80 px-3 py-1 text-xs font-medium text-pink-700 transition hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="primary"
              size="large"
              icon={<CameraOutlined />}
              loading={isLoading}
              disabled={!hasEnoughInput}
              onClick={handleSubmit}
              className="!h-11 !rounded-2xl !border-none !bg-gradient-to-r !from-pink-500 !to-fuchsia-500 !px-6 !font-semibold !shadow-[0_8px_20px_rgba(236,72,153,0.3)]"
            >
              Tìm trang phục bằng AI
            </Button>

            <Button
              size="large"
              disabled={!uploadList.length && !keyword}
              onClick={resetState}
              className="!h-11 !rounded-2xl border-pink-200 !text-pink-700"
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-200/80 bg-white/80 p-3 backdrop-blur">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-pink-600">
            Ảnh tham chiếu
          </p>

          <Upload
            accept="image/*"
            listType="picture-card"
            maxCount={1}
            fileList={uploadList}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            className="ai-search-uploader"
          >
            {uploadList.length >= 1 ? null : (
              <div className="flex flex-col items-center gap-1 text-pink-500">
                <CameraOutlined className="text-lg" />
                <span className="text-xs font-medium">Tải ảnh cosplay</span>
              </div>
            )}
          </Upload>

          {previewUrl && (
            <div className="mt-2 overflow-hidden rounded-xl border border-pink-100 bg-pink-50">
              <img src={previewUrl} alt="Preview upload" className="h-40 w-full object-cover" />
            </div>
          )}

          <div className="mt-3 flex items-center justify-between rounded-xl border border-pink-100 bg-pink-50/70 px-3 py-2 text-xs text-pink-700">
            <span className="line-clamp-1">{uploadList[0]?.name || "Chưa có ảnh nào được chọn"}</span>
            {!!uploadList.length && (
              <button
                type="button"
                onClick={() => {
                  setUploadList([])
                  setSelectedFile(null)
                }}
                className="rounded-md p-1 transition hover:bg-pink-100"
                aria-label="Xóa ảnh đã chọn"
              >
                <DeleteOutlined />
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading && <AILoadingMascot />}
    </div>
  )
}
