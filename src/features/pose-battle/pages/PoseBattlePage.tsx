import { useMemo, useState } from "react"
import { Button, Empty, Input, Modal, Spin, Tag, Upload } from "antd"
import type { UploadProps } from "antd"
import { ClockCircleOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons"

import AILoadingMascot from "@/shared/components/AILoadingMascot"
import { usePoseBattle } from "../hooks/usePoseBattle"
import PoseResultOverlay from "../components/PoseResultOverlay"
import type { PoseHistoryItem } from "../types"

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export default function PoseBattlePage() {
  const {
    referenceImage,
    setReferenceImage,
    characterName,
    setCharacterName,
    userImageFile,
    setUserImageFile,
    loading,
    result,
    randomTip,
    history,
    historyLoading,
    submit,
    closeResult,
    setResult,
  } = usePoseBattle()

  const [selectedHistory, setSelectedHistory] = useState<PoseHistoryItem | null>(null)

  const previewUrl = useMemo(() => {
    if (!userImageFile) return null
    return URL.createObjectURL(userImageFile)
  }, [userImageFile])

  const uploadPoseProps: UploadProps = {
    accept: "image/*",
    showUploadList: false,
    beforeUpload: (file) => {
      setUserImageFile(file)
      return false
    },
  }

  return (
    <section className="mx-auto max-w-7xl space-y-5 py-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-violet-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-violet-700">Ảnh gốc (Reference)</h2>

          <div className="mt-3 flex items-center gap-2">
            <Input
              value={characterName}
              onChange={(event) => setCharacterName(event.target.value)}
              placeholder="Tên nhân vật (VD: Naruto)"
              className="max-w-[280px]"
            />

            <Upload
              showUploadList={false}
              accept="image/*"
              beforeUpload={(file) => {
                const url = URL.createObjectURL(file)
                setReferenceImage(url)
                return false
              }}
            >
              <Button icon={<UploadOutlined />}>Upload ảnh mẫu riêng</Button>
            </Upload>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-dashed border-violet-300 bg-violet-50">
            {referenceImage ? (
              <img src={referenceImage} alt="Reference pose" className="h-72 w-full object-cover" />
            ) : (
              <div className="flex h-72 items-center justify-center text-sm text-slate-500">
                Upload ảnh nhân vật gốc để AI đối chiếu
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-pink-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold text-pink-700">Ảnh người dùng upload</h2>
            <button 
              type="button" 
              onClick={submit} 
              className="group relative rounded-2xl border border-pink-200 bg-gradient-to-br from-white via-pink-50 to-rose-100 px-4 py-2 text-sm font-normal text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-300 hover:from-pink-100 hover:to-purple-100 hover:shadow-[0_12px_24px_rgba(236,72,153,0.14)]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1 text-xs text-pink-500/80 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-600"
              >
                ✦
              </span>
              Chấm điểm
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <Input value={userImageFile?.name ?? ""} readOnly placeholder="Chưa chọn ảnh pose" className="max-w-[280px]" />
            <Upload {...uploadPoseProps}>
              <Button icon={<UploadOutlined />}>Upload ảnh pose</Button>
            </Upload>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-dashed border-pink-300 bg-pink-50">
            {previewUrl ? (
              <img src={previewUrl} alt="User pose preview" className="h-72 w-full object-cover" />
            ) : (
              <div className="flex h-72 items-center justify-center text-sm text-slate-500">Chưa có ảnh để chấm điểm</div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-800">Lịch sử chấm điểm Pose Battle</h3>
          <Tag color="magenta">{history.length} lượt chấm</Tag>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spin />
          </div>
        ) : history.length === 0 ? (
          <Empty description="Bạn chưa có lần chấm điểm nào" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedHistory(item)}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-pink-300 hover:shadow-md"
              >
                <img src={item.imageUrl} alt={`Pose score ${item.id}`} className="h-36 w-full object-cover" />
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">Lần chấm #{item.id}</p>
                    <Tag color={item.score >= 80 ? "green" : item.score >= 50 ? "gold" : "red"}>Điểm: {item.score}</Tag>
                  </div>
                  <p className="line-clamp-2 text-xs text-slate-600">{item.comment}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <ClockCircleOutlined /> {formatDateTime(item.createdAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="rounded-3xl border border-violet-100 bg-white p-5 text-center shadow-sm">
          <AILoadingMascot text={randomTip} />
        </div>
      )}

      {result && <PoseResultOverlay result={result} onClose={closeResult} />}

      <Modal
        open={Boolean(selectedHistory)}
        footer={null}
        onCancel={() => setSelectedHistory(null)}
        title="Chi tiết lượt chấm điểm"
        width={680}
      >
        {selectedHistory && (
          <div className="space-y-4">
            <img
              src={selectedHistory.imageUrl}
              alt={`Pose history ${selectedHistory.id}`}
              className="h-72 w-full rounded-2xl object-cover"
            />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-slate-800">Lần chấm #{selectedHistory.id}</p>
                <Tag color="magenta">{formatDateTime(selectedHistory.createdAt)}</Tag>
              </div>
              <p className="mt-2 text-sm text-slate-700">{selectedHistory.comment}</p>

              <div className="mt-4 flex gap-2">
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  className="bg-pink-600"
                  onClick={() => {
                    setResult({ score: selectedHistory.score, comment: selectedHistory.comment })
                    setSelectedHistory(null)
                  }}
                >
                  Xem lại popup kết quả
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
