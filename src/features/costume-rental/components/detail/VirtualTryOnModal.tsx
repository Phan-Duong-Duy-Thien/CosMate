import * as React from "react"
import { Loader2, Sparkles, UploadCloud, X, Download, Image, Camera, AlertCircle } from "lucide-react"
import { notification } from "antd"
import axiosInstance from "@/services/axiosInstance"
import { Dialog, DialogContent } from "@/shared/components/Dialog"

interface VirtualTryOnModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  costumeId: number
  costumeName: string
  costumeImageUrl?: string
}

export function VirtualTryOnModal({
  open,
  onOpenChange,
  costumeId,
  costumeName,
  costumeImageUrl,
}: VirtualTryOnModalProps) {
  const [personImage, setPersonImage] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [resultUrl, setResultUrl] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const cameraInputRef = React.useRef<HTMLInputElement>(null)

  // Reset modal state on open/close
  React.useEffect(() => {
    if (!open) {
      setPersonImage(null)
      setImagePreview(null)
      setResultUrl(null)
      setLoading(false)
    }
  }, [open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPersonImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setPersonImage(file)
        setImagePreview(URL.createObjectURL(file))
      } else {
        notification.error({
          message: "Sai định dạng file",
          description: "Vui lòng chỉ chọn hình ảnh chụp người dùng!",
          placement: "topRight",
        })
      }
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const triggerCameraSelect = () => {
    cameraInputRef.current?.click()
  }

  const handleStartVTO = async () => {
    if (!personImage) {
      notification.warning({
        message: "Chưa chọn ảnh",
        description: "Vui lòng chọn hoặc chụp ảnh cá nhân của bạn trước!",
        placement: "topRight",
      })
      return
    }

    setLoading(true)
    
    const formData = new FormData()
    formData.append("costumeId", costumeId.toString())
    formData.append("personImage", personImage)

    try {
      const response = await axiosInstance.post("/api/search/vto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Assuming API returns standard ApiResponse structure with result field
      const result = response.data?.result
      if (result) {
        setResultUrl(result)
        notification.success({
          message: "Thành công!",
          description: "Bé Mèo đã hoàn thành việc ghép trang phục cho bạn!",
          placement: "topRight",
        })
      } else {
        throw new Error("Không lấy được kết quả từ Backend")
      }
    } catch (error) {
      console.error("VTO error:", error)
      notification.error({
        message: "Thử đồ thất bại",
        description: "AI đang bận hoặc quá tải, vui lòng thử lại sau!",
        placement: "topRight",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!resultUrl) return

    try {
      notification.info({
        message: "Đang tải ảnh",
        description: "Vui lòng đợi giây lát...",
        placement: "topRight",
        duration: 2,
      })

      const response = await fetch(resultUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = url
      link.download = `cosmate-tryon-${costumeId}-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      // Fallback
      window.open(resultUrl, "_blank")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        onClose={() => !loading && onOpenChange(false)}
        className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] border-[5px] border-indigo-950 bg-[#fffbeb] p-6 shadow-[12px_12px_0_0_rgba(30,27,75,0.7)]"
      >
        {/* Header */}
        <div className="border-b-[4px] border-indigo-950 pb-4">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-indigo-950">
            <Sparkles className="h-6 w-6 text-fuchsia-600 animate-pulse" />
            <span>Thử đồ ảo AI (Virtual Try-On)</span>
          </h2>
          <p className="mt-1 text-xs font-semibold text-indigo-900/75">
            Trang phục: <span className="font-extrabold text-pink-600">{costumeName}</span>
          </p>
        </div>

        {/* Body content based on stage */}
        <div className="mt-6">
          {/* STEP 2: Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border-[4px] border-indigo-950 bg-gradient-to-tr from-pink-300 via-fuchsia-200 to-indigo-300 shadow-[6px_6px_0_0_#1e1b4b] animate-bounce">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-950" />
              </div>
              <h3 className="mt-8 text-base font-extrabold text-indigo-950 px-4">
                Bé Mèo đang cắt may trang phục cho bạn...
              </h3>
              <p className="mt-2 text-xs font-bold text-indigo-900/75 max-w-md px-6 leading-relaxed">
                Quá trình này mất khoảng 5 - 10 giây, vui lòng chờ nhé!
              </p>
              
              {/* Retro progress indicator */}
              <div className="mt-6 h-4 w-64 overflow-hidden rounded-full border-[3px] border-indigo-950 bg-white p-0.5 shadow-[3px_3px_0_0_#1e1b4b]">
                <div className="h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 animate-[pulse_1.5s_infinite] w-full" />
              </div>
            </div>
          )}

          {/* STEP 3: Result Showcase */}
          {!loading && resultUrl && (
            <div className="flex flex-col items-center">
              <div className="relative overflow-hidden rounded-3xl border-[4px] border-indigo-950 bg-white p-2 shadow-[8px_8px_0_0_rgba(30,27,75,0.6)]">
                <img 
                  src={resultUrl} 
                  alt="Virtual Try-On Result" 
                  className="max-h-[380px] w-auto rounded-2xl object-contain"
                />
                <span className="absolute bottom-4 left-4 rounded-xl border-[2.5px] border-indigo-950 bg-gradient-to-r from-yellow-300 to-amber-300 px-3 py-1 text-[11px] font-extrabold text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
                  ✨ Ảnh do AI thiết kế
                </span>
              </div>

              <p className="mt-4 text-center text-xs font-bold text-indigo-900/80 px-6 leading-relaxed">
                Trông bạn thật tuyệt vời trong bộ cosplay này! Hãy tải hình ảnh về và bấm đóng để tiến hành đặt thuê nhé.
              </p>

              {/* Actions for Result */}
              <div className="mt-6 flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 rounded-xl border-[3px] border-indigo-950 bg-white py-2.5 text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] transition hover:bg-slate-50 hover:brightness-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#1e1b4b]"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 py-2.5 text-sm font-extrabold text-white shadow-[4px_4px_0_0_#1e1b4b] transition hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#1e1b4b]"
                >
                  <Download className="h-4 w-4" />
                  <span>Tải ảnh về</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Upload & Input Area */}
          {!loading && !resultUrl && (
            <div className="space-y-5">
              {/* Instruction Banner */}
              <div className="flex gap-2 rounded-2xl border-[3px] border-amber-600 bg-amber-50 p-3.5 shadow-[4px_4px_0_0_rgba(217,119,6,0.2)]">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                <p className="text-xs font-bold leading-relaxed text-amber-900/90">
                  Lưu ý: Hãy chọn ảnh chụp thẳng người, rõ dáng và đủ sáng để AI ghép đồ trông thật và đẹp mắt nhất nhé!
                </p>
              </div>

              {/* Upload Workspace */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Costume display */}
                <div className="flex flex-col items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-white p-3 shadow-[5px_5px_0_0_rgba(30,27,75,0.25)]">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-950/60 mb-2">Trang phục thử</span>
                  <div className="h-44 w-36 overflow-hidden rounded-xl border-2 border-indigo-950/20 bg-slate-50">
                    {costumeImageUrl ? (
                      <img src={costumeImageUrl} alt={costumeName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Image className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <span className="mt-2 text-center text-xs font-bold text-indigo-950 line-clamp-1 px-2">{costumeName}</span>
                </div>

                {/* Dropzone area */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="flex flex-col items-center justify-center rounded-2xl border-[3px] border-dashed border-indigo-950 bg-white p-4 shadow-[5px_5px_0_0_rgba(30,27,75,0.25)] min-h-[220px]"
                >
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <div className="relative h-32 w-28 overflow-hidden rounded-xl border-[2.5px] border-indigo-950 shadow-[4px_4px_0_0_rgba(30,27,75,0.2)]">
                        <img src={imagePreview} alt="User Preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setPersonImage(null)
                            setImagePreview(null)
                          }}
                          className="absolute right-1 top-1 rounded-full border-2 border-indigo-950 bg-white p-0.5 text-indigo-950 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="mt-2 text-center text-xs font-extrabold text-indigo-950">Ảnh đã chọn</span>
                      <button
                        type="button"
                        onClick={triggerFileSelect}
                        className="mt-2 text-[11px] font-bold text-fuchsia-700 underline hover:text-fuchsia-900"
                      >
                        Đổi ảnh khác
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="rounded-full bg-pink-100 p-3 text-pink-600">
                        <UploadCloud className="h-8 w-8" />
                      </div>
                      <p className="mt-3 text-xs font-extrabold text-indigo-950">
                        Kéo thả ảnh hoặc nhấp để tải lên
                      </p>
                      <p className="mt-1 text-[10px] font-medium text-slate-400">
                        Hỗ trợ định dạng PNG, JPG, JPEG
                      </p>
                      
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={triggerFileSelect}
                          className="flex items-center gap-1.5 rounded-lg border-2 border-indigo-950 bg-white px-3 py-1.5 text-xs font-bold text-indigo-950 shadow-[2px_2px_0_0_#1e1b4b] hover:bg-slate-50 active:translate-y-[1px] active:shadow-[1px_1px_0_0_#1e1b4b]"
                        >
                          <Image className="h-3.5 w-3.5" />
                          <span>Tải ảnh lên</span>
                        </button>
                        <button
                          type="button"
                          onClick={triggerCameraSelect}
                          className="flex items-center gap-1.5 rounded-lg border-2 border-indigo-950 bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1.5 text-xs font-bold text-indigo-950 shadow-[2px_2px_0_0_#1e1b4b] hover:brightness-105 active:translate-y-[1px] active:shadow-[1px_1px_0_0_#1e1b4b]"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          <span>Chụp ảnh</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Hidden Inputs */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    capture="user"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Start Button */}
              <button
                type="button"
                disabled={!personImage}
                onClick={handleStartVTO}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-[3.5px] border-indigo-950 py-3 text-sm font-extrabold text-white shadow-[6px_6px_0_0_#1e1b4b] transition ${
                  personImage
                    ? "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0_0_#1e1b4b]"
                    : "bg-slate-400 border-slate-500 text-slate-200 cursor-not-allowed shadow-none"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Bắt đầu thử đồ</span>
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
