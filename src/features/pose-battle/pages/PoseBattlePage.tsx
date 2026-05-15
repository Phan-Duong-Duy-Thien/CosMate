import { useDeferredValue, useEffect, useMemo, useState } from "react"
import { Alert, Empty, Input, Modal, Pagination, Popconfirm, Spin, Tag, Upload, notification } from "antd"
import type { UploadProps } from "antd"
import { ClockCircleOutlined, DeleteOutlined, EyeOutlined, ShareAltOutlined, UploadOutlined } from "@ant-design/icons"

import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import AILoadingMascot from "@/shared/components/AILoadingMascot"
import { usePoseBattle } from "../hooks/usePoseBattle"
import PoseResultOverlay from "../components/PoseResultOverlay"
import type { PoseHistoryItem, PoseScoringResult } from "../types"

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

function formatScore(value?: number) {
  return typeof value === 'number' ? value.toFixed(1) : '0.0'
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
  const poseResult = result as PoseScoringResult | null

  const [selectedHistory, setSelectedHistory] = useState<PoseHistoryItem | null>(null)
  const [historyPage, setHistoryPage] = useState(1)
  const [searchInput, setSearchInput] = useState(searchKeyword)
  const historyPageSize = 6
  const deferredSearchKeyword = useDeferredValue(searchInput)

  const paginatedHistory = useMemo(() => {
    const startIndex = (historyPage - 1) * historyPageSize
    return history.slice(startIndex, startIndex + historyPageSize)
  }, [history, historyPage])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchKeyword(deferredSearchKeyword)
      setHistoryPage(1)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [deferredSearchKeyword, setSearchKeyword])

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
    <section className="relative mx-auto max-w-7xl space-y-4 py-4">
      <div className="pointer-events-none absolute left-4 top-4 h-24 w-24 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <div className="pointer-events-none absolute right-6 top-10 h-28 w-28 rounded-full bg-cyan-300/30 blur-3xl" />

      <div className="sticky top-[72px] z-20 grid gap-4 rounded-[2rem] border-[3px] border-indigo-950/90 bg-[linear-gradient(180deg,#fffbeb_0%,#fff7ed_100%)] p-3 shadow-[10px_10px_0px_#312e81] backdrop-blur-sm lg:grid-cols-2">
        <Card className="rounded-[1.75rem] border-[3px] border-indigo-950 p-4 shadow-[8px_8px_0px_#f9a8d4]">
          <div className="mb-3 inline-flex rounded-full border-2 border-indigo-950 bg-fuchsia-200 px-3 py-1 text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0px_#312e81]">
            Ảnh gốc (Reference)
          </div>

          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <Input
              value={characterName}
              onChange={(event) => setCharacterName(event.target.value)}
              placeholder="Tên nhân vật (VD: Naruto)"
              className="!h-12 !rounded-2xl !border-[3px] !border-indigo-950 bg-white font-semibold text-slate-800 shadow-[4px_4px_0px_#c4b5fd] placeholder:text-slate-400 hover:!border-fuchsia-500 focus:!border-fuchsia-500"
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
              <Button variant="outline" size="md" className="min-h-12 rounded-2xl border-[3px] border-indigo-950 bg-amber-200 px-4 text-indigo-950 shadow-[4px_4px_0px_#312e81] hover:bg-amber-300" type="button">
                <UploadOutlined />
                Upload ảnh mẫu riêng
              </Button>
            </Upload>
          </div>

          <div className="mt-3 flex items-center justify-center rounded-[1.5rem] border-[3px] border-dashed border-indigo-950 bg-gradient-to-br from-fuchsia-50 via-amber-50 to-cyan-50 p-2 shadow-[6px_6px_0px_#c4b5fd]">
            {referenceImage ? (
              <img src={referenceImage} alt="Reference pose" className="block h-auto max-h-[60vh] w-auto max-w-full rounded-xl object-contain" />
            ) : (
              <div className="flex h-60 items-center justify-center text-sm text-slate-500">
                Upload ảnh nhân vật gốc để AI đối chiếu
              </div>
            )}
          </div>
        </Card>

        <Card className="rounded-[1.75rem] border-[3px] border-indigo-950 p-4 shadow-[8px_8px_0px_#fbcfe8]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-indigo-950">Ảnh người dùng upload</h2>
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="group relative rounded-2xl border-[3px] border-indigo-950 bg-gradient-to-r from-fuchsia-200 via-pink-200 to-amber-200 px-4 py-2 text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0px_#312e81] transition-all duration-300 hover:-translate-y-0.5 hover:bg-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Đang chấm...' : 'Chấm điểm'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Input
              value={userImageFile?.name ?? ""}
              readOnly
              placeholder="Chưa chọn ảnh pose"
              className="flex-1 !h-12 !rounded-2xl !border-[3px] !border-indigo-950 bg-white font-semibold text-slate-800 shadow-[4px_4px_0px_#fde68a] placeholder:text-slate-400"
            />
            <Upload {...uploadPoseProps}>
              <Button variant="outline" size="md" className="rounded-2xl border-[3px] border-indigo-950 bg-cyan-200 px-4 text-indigo-950 shadow-[4px_4px_0px_#312e81] hover:bg-cyan-300" type="button">
                <UploadOutlined />
                Upload ảnh pose
              </Button>
            </Upload>
          </div>

          <div className="mt-3 flex items-center justify-center rounded-[1.5rem] border-[3px] border-dashed border-indigo-950 bg-gradient-to-br from-cyan-50 via-white to-fuchsia-50 p-2 shadow-[6px_6px_0px_#fde68a]">
            {previewUrl ? (
              <img src={previewUrl} alt="User pose preview" className="block h-auto max-h-[60vh] w-auto max-w-full rounded-xl object-contain" />
            ) : (
              <div className="flex h-60 items-center justify-center text-sm text-slate-500">Chưa có ảnh để chấm điểm</div>
            )}
          </div>
        </Card>
      </div>

      <Card className="rounded-[1.75rem] border-[3px] border-indigo-950 p-5 shadow-[8px_8px_0px_#c4b5fd]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-extrabold text-indigo-950">Lịch sử chấm điểm Pose Battle</h3>
          <Tag className="rounded-full border-2 border-indigo-950 bg-fuchsia-200 px-3 py-1 text-sm font-bold text-indigo-950">{history.length} lượt chấm</Tag>
        </div>

        <div className="mb-4">
          <div className="flex h-12 items-stretch overflow-hidden rounded-xl border-[3px] border-indigo-950 bg-white shadow-[4px_4px_0_0_#1e1b4b] focus-within:translate-y-[2px] focus-within:shadow-[2px_2px_0_0_#1e1b4b]">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onPressEnter={(event) => setSearchInput((event.target as HTMLInputElement).value)}
              placeholder="Tìm kiếm theo tên nhân vật..."
              className="h-full flex-1 !border-none !bg-transparent !px-4 !text-slate-800 !outline-none placeholder:!text-slate-400"
            />
          </div>
        </div>

        <div className="flex min-h-[600px] flex-col">
          {historyLoading ? (
            <div className="flex flex-1 items-center justify-center py-10">
              <Spin />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <Empty description="Bạn chưa có lần chấm điểm nào" />
            </div>
          ) : (
            <>
              <div className="flex flex-1 flex-col gap-3">
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
                      className="overflow-hidden rounded-[1.5rem] border-[3px] border-indigo-950 text-left shadow-[6px_6px_0px_#fbcfe8] transition hover:-translate-y-1 hover:bg-amber-50 hover:shadow-[8px_8px_0px_#312e81]"
                    >
                      <div className="overflow-hidden rounded-t-[1.5rem] border-b-[3px] border-indigo-950">
                        <img
                          src={item.imageUrl}
                          alt={`Pose score ${item.id}`}
                          className="block h-32 w-full bg-slate-50 object-cover"
                        />
                      </div>

                      <div className="space-y-1 bg-[linear-gradient(180deg,#fff_0%,#fff7ed_100%)] p-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-extrabold text-indigo-950">
                              {item.characterName?.trim() ? item.characterName : "Nhân vật ẩn danh"}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full border-[2px] border-indigo-950 bg-cyan-200 px-2 py-0.5 text-[11px] font-extrabold text-indigo-950 shadow-[3px_3px_0px_#312e81]">
                            {item.score}
                          </span>
                        </div>

                        <p className="line-clamp-2 text-[11px] leading-5 text-slate-700">{cleanAiComment(item.comment)}</p>

                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <p className="flex items-center gap-1 text-[11px] text-slate-600">
                            <ClockCircleOutlined /> {formatDateTime(item.createdAt)}
                          </p>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-2xl border-[2px] border-indigo-950 bg-cyan-200 shadow-[3px_3px_0px_#312e81] hover:bg-cyan-300"
                              onClick={async (event) => {
                                event.stopPropagation()
                                const shareUrl = `${window.location.origin}/pose-battle/${item.id}`
                                try {
                                  await navigator.clipboard.writeText(shareUrl)
                                  notification.success({ message: 'Đã copy link chia sẻ!' })
                                } catch {
                                  notification.error({ message: 'Không thể copy link chia sẻ.' })
                                }
                              }}
                            >
                              <ShareAltOutlined />
                              Chia sẻ
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
                                className="rounded-2xl border-[2px] border-indigo-950 bg-rose-200 shadow-[3px_3px_0px_#312e81] hover:bg-rose-300"
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

              <div className="mt-auto flex justify-end pt-2">
                <Pagination
                  current={historyPage}
                  pageSize={historyPageSize}
                  total={history.length}
                  onChange={(page) => setHistoryPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </div>
      </Card>

      {loading && <AILoadingMascot type="pose" />}

      {result && <PoseResultOverlay result={result} onClose={closeResult} />}

      <Modal
        open={Boolean(poseResult && (poseResult.pose_score !== undefined || poseResult.expression_score !== undefined || poseResult.costume_score !== undefined))}
        footer={null}
        onCancel={closeResult}
        title={null}
        centered
        width={720}
        className="pose-result-modal"
      >
        {poseResult && (
          <div className="space-y-4 rounded-[1.5rem] border-[3px] border-indigo-950 bg-[linear-gradient(180deg,#fffbeb_0%,#fff7ed_100%)] p-4 shadow-[8px_8px_0px_#c4b5fd]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-700">Pose Battle</p>
                <h4 className="text-2xl font-extrabold text-indigo-950">Chi tiết chấm điểm</h4>
              </div>
              <button
                type="button"
                onClick={closeResult}
                className="rounded-full border-[3px] border-indigo-950 bg-fuchsia-200 px-3 py-2 text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0px_#312e81]"
              >
                Đóng
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: 'Pose', value: poseResult.pose_score ?? poseResult.breakdown?.pose },
                { label: 'Biểu cảm', value: poseResult.expression_score ?? poseResult.breakdown?.expression },
                { label: 'Trang phục', value: poseResult.costume_score ?? poseResult.breakdown?.costume },
                { label: 'Tổng', value: poseResult.score },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.25rem] border-[3px] border-indigo-950 bg-white p-4 text-center shadow-[4px_4px_0px_#f9a8d4]">
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-950">{item.label}</p>
                  <p className="mt-1 text-3xl font-extrabold text-fuchsia-700">{formatScore(item.value)}</p>
                </div>
              ))}
            </div>

            <Alert
              type="info"
              showIcon
              className="rounded-2xl border-[2px] border-indigo-950 bg-cyan-50"
              message="Kết quả đã được cập nhật theo cấu trúc điểm mới từ backend."
            />
          </div>
        )}
      </Modal>

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
