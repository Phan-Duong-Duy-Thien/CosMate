import { useMemo, useRef, useState } from "react"
import Webcam from "react-webcam"
import { Button, Input, Tabs, Upload } from "antd"
import { CameraOutlined, UploadOutlined } from "@ant-design/icons"

import AILoadingMascot from "@/shared/components/AILoadingMascot"
import { POSE_REFERENCE_LIST, POSE_SCORE_ASSETS } from "../constants/poseBattle.constants"
import { usePoseBattle } from "../hooks/usePoseBattle"
import PoseResultOverlay from "../components/PoseResultOverlay"

export default function PoseBattlePage() {
  const webcamRef = useRef<Webcam | null>(null)
  const [activeTab, setActiveTab] = useState("camera")

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
    submit,
    closeResult,
  } = usePoseBattle()

  const previewUrl = useMemo(() => {
    if (!userImageFile) return null
    return URL.createObjectURL(userImageFile)
  }, [userImageFile])

  const handleCapture = () => {
    const screenshot = webcamRef.current?.getScreenshot()
    if (!screenshot) return

    fetch(screenshot)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], `pose-${Date.now()}.jpg`, { type: "image/jpeg" })
        setUserImageFile(file)
      })
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 py-8">
      <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-violet-700">AI Pose Battle</h1>
        <p className="mt-2 text-sm text-slate-600">So tài dáng pose của bạn với nhân vật yêu thích ngay nào.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Pose mẫu (Reference)</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {POSE_REFERENCE_LIST.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setReferenceImage(item.imageUrl)
                  setCharacterName(item.characterName)
                }}
                className="overflow-hidden rounded-2xl border border-slate-200 text-left transition hover:border-violet-400"
              >
                <img src={item.imageUrl} alt={item.characterName} className="h-28 w-full object-cover" />
                <p className="px-2 py-2 text-xs font-medium text-slate-700">{item.characterName}</p>
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <Input
              value={characterName}
              onChange={(event) => setCharacterName(event.target.value)}
              placeholder="Tên nhân vật"
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

          <div className="mt-4 overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            {referenceImage ? (
              <img src={referenceImage} alt="Reference pose" className="h-72 w-full object-cover" />
            ) : (
              <div className="flex h-72 items-center justify-center text-sm text-slate-500">Chọn một pose mẫu để bắt đầu</div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Ảnh của bạn</h2>

          <Tabs
            className="mt-3"
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "camera",
                label: "Chụp ảnh",
                children: (
                  <div className="space-y-3">
                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                      <Webcam
                        ref={webcamRef}
                        mirrored
                        screenshotFormat="image/jpeg"
                        className="h-72 w-full object-cover"
                      />
                    </div>
                    <Button type="primary" icon={<CameraOutlined />} onClick={handleCapture}>
                      Chụp ảnh
                    </Button>
                  </div>
                ),
              },
              {
                key: "upload",
                label: "Tải ảnh từ máy",
                children: (
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      setUserImageFile(file)
                      return false
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh từ máy</Button>
                  </Upload>
                ),
              },
            ]}
          />

          <div className="mt-4 overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            {previewUrl ? (
              <img src={previewUrl} alt="User pose preview" className="h-72 w-full object-cover" />
            ) : (
              <div className="flex h-72 items-center justify-center text-sm text-slate-500">Chưa có ảnh để chấm điểm</div>
            )}
          </div>

          <Button type="primary" className="mt-4 w-full" size="large" onClick={submit}>
            Chấm điểm
          </Button>
        </div>
      </div>

      {loading && (
        <div className="rounded-3xl border border-violet-100 bg-white p-6 text-center shadow-sm">
          <AILoadingMascot imageSrc={POSE_SCORE_ASSETS.loading} text={randomTip} />
        </div>
      )}

      {result && <PoseResultOverlay result={result} onClose={closeResult} />}
    </section>
  )
}
