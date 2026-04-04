import { useCallback, useState } from "react"
import { CameraOutlined } from "@ant-design/icons"
import { Button, Input, Modal, Upload, notification } from "antd"
import type { UploadFile, UploadProps } from "antd"

import AILoadingMascot from "@/shared/components/AILoadingMascot"
import { useAISearch, type AISearchResultItem } from "@/features/search/hooks/useAISearch"

interface AISearchBarProps {
  onSearchCompleted?: (results: AISearchResultItem[]) => void
}

export default function AISearchBar({ onSearchCompleted }: AISearchBarProps) {
  const { executeSearch, isLoading } = useAISearch()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadList, setUploadList] = useState<UploadFile[]>([])

  const resetModalState = () => {
    setKeyword("")
    setSelectedFile(null)
    setUploadList([])
  }

  const handleOpenModal = () => setIsModalOpen(true)

  const handleCloseModal = () => {
    setIsModalOpen(false)
    resetModalState()
  }

  const handleUploadChange: UploadProps["onChange"] = useCallback((info: Parameters<NonNullable<UploadProps["onChange"]>>[0]) => {
    const normalized = info.fileList.slice(-1)
    setUploadList(normalized)

    const latestFile = normalized[0]?.originFileObj
    setSelectedFile(latestFile ?? null)
  }, [])

  const handleSubmit = async () => {
    if (!selectedFile) {
      notification.warning({
        message: "Vui lòng chọn 1 ảnh để tìm kiếm.",
      })
      return
    }

    if (!keyword.trim()) {
      notification.warning({
        message: "Vui lòng nhập từ khóa mô tả để AI tìm chính xác hơn.",
      })
      return
    }

    setIsModalOpen(false)

    const result = await executeSearch({
      files: [selectedFile],
      text: keyword.trim(),
    })

    if (result) {
      onSearchCompleted?.(result)
      notification.success({
        message: `Tìm thấy ${result.length} kết quả!`,
      })
      resetModalState()
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 rounded-xl border border-pink-100 bg-white p-2 shadow-sm">
        <Input
          placeholder="Tìm trang phục cosplay bằng AI..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="border-0 shadow-none focus:shadow-none"
        />

        <Button
          type="text"
          icon={<CameraOutlined className="text-lg text-pink-500" />}
          onClick={handleOpenModal}
          className="!flex !items-center !justify-center"
          aria-label="Mở tìm kiếm bằng ảnh"
        />
      </div>

      {isLoading && <AILoadingMascot />}

      <Modal
        title="Tìm kiếm bằng ảnh + từ khóa"
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        okText="Tìm kiếm ngay"
        cancelText="Hủy"
        destroyOnHidden
      >
        <div className="space-y-4 pt-1">
          <Upload
            accept="image/*"
            listType="picture-card"
            maxCount={1}
            fileList={uploadList}
            beforeUpload={() => false}
            onChange={handleUploadChange}
          >
            {uploadList.length >= 1 ? null : (
              <div className="flex flex-col items-center text-pink-500">
                <CameraOutlined />
                <span className="mt-1 text-xs">Tải ảnh</span>
              </div>
            )}
          </Upload>

          <Input
            placeholder="Nhập từ khóa mô tả (VD: kimono hồng, naruto,...)"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
      </Modal>
    </div>
  )
}
