import { useEffect, useMemo, useState } from "react"
import { Empty, Input, Modal, Pagination, Popconfirm, Spin, Tag, Upload } from "antd"
import type { UploadProps } from "antd"
import { ClockCircleOutlined, DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons"

import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import AILoadingMascot from "@/shared/components/AILoadingMascot"
import { usePoseBattle } from "../hooks/usePoseBattle"
import PoseResultOverlay from "../components/PoseResultOverlay"
import type { PoseHistoryItem } from "../types"

const { Search } = Input

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
    searchKeyword,
    setSearchKeyword,
    submit,
    closeResult,
    setResult,
    renameHistoryItem,
    removeHistoryItem,
  } = usePoseBattle()

  const [selectedHistory, setSelectedHistory] = useState<PoseHistoryItem | null>(null)
  const [historyPage, setHistoryPage] = useState(1)
  const historyPageSize = 6

  const paginatedHistory = useMemo(() => {
    const startIndex = (historyPage - 1) * historyPageSize
    return history.slice(startIndex, startIndex + historyPageSize)
  }, [history, historyPage])

  useEffect(() => {
    setHistoryPage(1)
  }, [searchKeyword])

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(history.length / historyPageSize))
    if (historyPage > maxPage) {
      setHistoryPage(maxPage)
    }
  }, [history.length, historyPage])

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
        <Card className="rounded-3xl border-pink-200 p-3.5">
          <h2 className="mb-2 text-base font-semibold text-pink-700">Ảnh gốc (Reference)</h2>

          <div className="flex items-center justify-between gap-2">
            <Input
              value={characterName}
              onChange={(event) => setCharacterName(event.target.value)}
              placeholder="Tên nhân vật (VD: Naruto)"
              className="flex-1 !border-pink-200 hover:!border-pink-300 focus:!border-pink-400"
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
              <Button variant="outline" size="md" className="border-pink-200 text-pink-700" type="button">
                <UploadOutlined />
                Upload ảnh mẫu riêng
              </Button>
            </Upload>
          </div>

          <div className="mt-2 flex items-center justify-center rounded-2xl border border-dashed border-violet-300 bg-violet-50 p-2">
            {referenceImage ? (
              <img src={referenceImage} alt="Reference pose" className="block h-auto max-h-[60vh] w-auto max-w-full rounded-xl object-contain" />
            ) : (
              <div className="flex h-60 items-center justify-center text-sm text-slate-500">
                Upload ảnh nhân vật gốc để AI đối chiếu
              </div>
            )}
          </div>
        </Card>

        <Card className="rounded-3xl border-pink-200 p-3.5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-pink-700">Ảnh người dùng upload</h2>
            <button
              type="button"
              onClick={submit}
              className="group relative rounded-2xl border border-pink-200 bg-gradient-to-br from-white via-pink-50 to-rose-100 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-300 hover:from-pink-100 hover:to-purple-100 hover:shadow-[0_12px_24px_rgba(236,72,153,0.14)]"
            >
              Chấm điểm
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Input
              value={userImageFile?.name ?? ""}
              readOnly
              placeholder="Chưa chọn ảnh pose"
              className="flex-1 !border-pink-200 hover:!border-pink-300 focus:!border-pink-400"
            />
            <Upload {...uploadPoseProps}>
              <Button variant="outline" size="md" className="border-pink-200 text-pink-700" type="button">
                <UploadOutlined />
                Upload ảnh pose
              </Button>
            </Upload>
          </div>

          <div className="mt-2 flex items-center justify-center rounded-2xl border border-dashed border-pink-300 bg-pink-50 p-2">
            {previewUrl ? (
              <img src={previewUrl} alt="User pose preview" className="block h-auto max-h-[60vh] w-auto max-w-full rounded-xl object-contain" />
            ) : (
              <div className="flex h-60 items-center justify-center text-sm text-slate-500">Chưa có ảnh để chấm điểm</div>
            )}
          </div>
        </Card>
      </div>

      <Card className="rounded-3xl border-pink-100 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-800">Lịch sử chấm điểm Pose Battle</h3>
          <Tag color="magenta">{history.length} lượt chấm</Tag>
        </div>

        <div className="mb-4">
          <Search
            allowClear
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            onSearch={(value) => setSearchKeyword(value)}
            placeholder="Tìm kiếm theo tên nhân vật..."
            className="[&_.ant-input]:!border-pink-200 [&_.ant-input]:hover:!border-pink-300 [&_.ant-input]:focus:!border-pink-400 [&_.ant-input-group-addon_.ant-btn]:!border-pink-200"
          />
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spin />
          </div>
        ) : history.length === 0 ? (
          <Empty description="Bạn chưa có lần chấm điểm nào" />
        ) : (
          <div className="space-y-3">
            <div className="max-h-[620px] overflow-y-auto pr-1 overscroll-contain">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {paginatedHistory.map((item) => (
                  <Card
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedHistory(item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        setSelectedHistory(item)
                      }
                    }}
                    className="overflow-hidden border-pink-100 text-left transition hover:-translate-y-0.5 hover:border-pink-300 hover:shadow-md"
                  >
                    <div className="overflow-hidden rounded-t-2xl">
                      <img
                        src={item.imageUrl}
                        alt={`Pose score ${item.id}`}
                        className="block h-36 w-full bg-slate-50 object-contain"
                      />
                    </div>

                    <div className="space-y-1.5 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-bold text-pink-700">
                            {item.characterName?.trim() ? item.characterName : "Nhân vật ẩn danh"}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-700">
                          Điểm: {item.score}
                        </span>
                      </div>

                      <p className="line-clamp-2 text-xs leading-5 text-slate-700">{cleanAiComment(item.comment)}</p>

                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <ClockCircleOutlined /> {formatDateTime(item.createdAt)}
                        </p>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async (event) => {
                              event.stopPropagation()
                              const nextName = window.prompt("Nhập tên nhân vật mới", item.characterName ?? "")
                              if (nextName === null) return
                              await renameHistoryItem(item.id, nextName.trim())
                            }}
                          >
                            <EditOutlined />
                            Sửa
                          </Button>

                          <Popconfirm
                            title="Bạn có chắc chắn muốn xóa lịch sử này không? Không thể hoàn tác."
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={async (event) => {
                              event?.stopPropagation()
                              await removeHistoryItem(item.id)
                            }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-rose-200 text-rose-600 hover:bg-rose-50"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <DeleteOutlined />
                              Xóa
                            </Button>
                          </Popconfirm>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Pagination
                current={historyPage}
                pageSize={historyPageSize}
                total={history.length}
                onChange={(page) => setHistoryPage(page)}
                showSizeChanger={false}
              />
            </div>
          </div>
        )}
      </Card>

      {loading && <AILoadingMascot type="pose" />}

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
                <Button variant="outline" size="sm" onClick={() => setSelectedHistory(null)}>
                  Đóng
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setResult({
                      id: selectedHistory.id,
                      score: selectedHistory.score,
                      comment: cleanAiComment(selectedHistory.comment),
                      characterName: selectedHistory.characterName,
                      imageUrl: selectedHistory.imageUrl,
                    })
                    setSelectedHistory(null)
                  }}
                >
                  <EyeOutlined />
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
