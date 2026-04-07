import { useMemo, useState } from "react"
import { Button, Empty, Input, Modal, Spin, Tag, Upload } from "antd"
import type { UploadProps } from "antd"
import { ClockCircleOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons"

import poseLoadingVideo from "@/assets/video-mascot-pose.mp4"
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

function cleanAiComment(raw: string) {
  return raw
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/`/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
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
    <section className="mx-auto max-w-7xl space-y-4 py-3">
      <div className="sticky top-[72px] z-20 grid gap-3 bg-white/70 pb-2 backdrop-blur-sm lg:grid-cols-2">
        <div className="rounded-3xl border border-violet-200 bg-white p-3.5 shadow-sm">
          <h2 className="mb-2 text-base font-semibold text-violet-700">Ảnh gốc (Reference)</h2>

          <div className="flex items-center justify-between gap-2">
            <Input
              value={characterName}
              onChange={(event) => setCharacterName(event.target.value)}
              placeholder="Tên nhân vật (VD: Naruto)"
              className="flex-1"
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
              <Button
                className="border-pink-200 text-pink-600 hover:!border-pink-300 hover:!text-pink-700"
                icon={<UploadOutlined />}
              >
                Upload ảnh mẫu riêng
              </Button>
            </Upload>
          </div>

          <div className="mt-2 overflow-hidden rounded-2xl border border-dashed border-violet-300 bg-violet-50">
            {referenceImage ? (
              <img src={referenceImage} alt="Reference pose" className="h-60 w-full bg-slate-50 object-contain" />
            ) : (
              <div className="flex h-60 items-center justify-center text-sm text-slate-500">
                Upload ảnh nhân vật gốc để AI đối chiếu
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-pink-200 bg-white p-3.5 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-pink-700">Ảnh người dùng upload</h2>
            <button
              type="button"
              onClick={submit}
              className="group relative rounded-2xl border border-pink-200 bg-gradient-to-br from-white via-pink-50 to-rose-100 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-300 hover:from-pink-100 hover:to-purple-100 hover:shadow-[0_12px_24px_rgba(236,72,153,0.14)]"
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

          <div className="flex items-center justify-between gap-2">
            <Input value={userImageFile?.name ?? ""} readOnly placeholder="Chưa chọn ảnh pose" className="flex-1" />
            <Upload {...uploadPoseProps}>
              <Button
                className="border-pink-200 text-pink-600 hover:!border-pink-300 hover:!text-pink-700"
                icon={<UploadOutlined />}
              >
                Upload ảnh pose
              </Button>
            </Upload>
          </div>

          <div className="mt-2 overflow-hidden rounded-2xl border border-dashed border-pink-300 bg-pink-50">
            {previewUrl ? (
              <img src={previewUrl} alt="User pose preview" className="h-60 w-full bg-slate-50 object-contain" />
            ) : (
              <div className="flex h-60 items-center justify-center text-sm text-slate-500">Chưa có ảnh để chấm điểm</div>
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
                <img src={item.imageUrl} alt={`Pose score ${item.id}`} className="h-36 w-full bg-slate-50 object-contain" />
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">Lần chấm #{item.id}</p>
                    <span className="rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-700">
                      Điểm: {item.score}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-slate-700">{cleanAiComment(item.comment)}</p>
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
        <div className="fixed inset-0 z-[21000] flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-5 text-center shadow-2xl">
            <div className="mx-auto flex h-64 w-full max-w-sm items-center justify-center rounded-2xl bg-white p-3">
              <video
                src={poseLoadingVideo}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-contain"
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-pink-700">AI đang chấm điểm pose của bạn...</p>
            <p className="mt-1 text-xs text-slate-500">Quá trình này có thể mất khoảng 30-120 giây, vui lòng đợi.</p>
          </div>
        </div>
      )}

      {result && <PoseResultOverlay result={result} onClose={closeResult} />}

      <Modal
        open={Boolean(selectedHistory)}
        footer={null}
        onCancel={() => setSelectedHistory(null)}
        title={null}
        width={700}
        style={{ top: 12 }}
        zIndex={12000}
        styles={{ body: { paddingTop: 8, paddingBottom: 10 } }}
      >
        {selectedHistory && (
          <div className="space-y-2.5">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <img
                src={selectedHistory.imageUrl}
                alt={`Pose history ${selectedHistory.id}`}
                className="h-52 w-full bg-slate-50 object-contain"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-base font-semibold text-slate-800">Chi tiết lượt chấm #{selectedHistory.id}</p>
                <div className="flex items-center gap-2">
                  <Tag color={selectedHistory.score >= 80 ? "green" : selectedHistory.score >= 50 ? "gold" : "red"}>
                    Điểm: {selectedHistory.score}
                  </Tag>
                  <Tag color="magenta">{formatDateTime(selectedHistory.createdAt)}</Tag>
                </div>
              </div>

              <div className="mt-2 rounded-xl border border-pink-100 bg-white p-2.5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-pink-700">Nhận xét AI</p>
                <div
                  className="max-h-64 overflow-y-auto pr-1 text-sm font-medium leading-6 text-slate-700 whitespace-pre-wrap break-words overscroll-contain"
                  onWheel={(event) => event.stopPropagation()}
                >
                  {cleanAiComment(selectedHistory.comment)}
                </div>
              </div>

              <div className="mt-2.5 flex justify-end gap-2">
                <Button
                  className="border-pink-200 text-pink-700 hover:!border-pink-300 hover:!text-pink-800 focus:!border-pink-400 focus:!text-pink-700"
                  onClick={() => setSelectedHistory(null)}
                >
                  Đóng
                </Button>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  className="!border-pink-600 !bg-pink-600 hover:!border-pink-500 hover:!bg-pink-500"
                  onClick={() => {
                    setResult({ score: selectedHistory.score, comment: cleanAiComment(selectedHistory.comment) })
                    setSelectedHistory(null)
                  }}
                >
                  Xem popup kết quả
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
