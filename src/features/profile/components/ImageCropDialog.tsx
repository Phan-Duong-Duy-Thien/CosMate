import * as React from "react"
import Cropper, { type Area } from "react-easy-crop"
import "react-easy-crop/react-easy-crop.css"
import { Dialog, DialogContent } from "@/shared/components/Dialog"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"

interface CropResult {
  file: File
  dataUrl: string
}

interface ImageCropDialogProps {
  open: boolean
  file: File | null
  title: string
  aspect: number
  cropShape?: "rect" | "round"
  onOpenChange: (open: boolean) => void
  onConfirm: (result: CropResult) => Promise<void> | void
}

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.src = src
  })
}

async function getCroppedResult(
  imageSrc: string,
  pixelCrop: Area,
  fileName: string,
  fileType: string
): Promise<CropResult> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Canvas is not supported")
  }

  canvas.width = Math.max(1, Math.floor(pixelCrop.width))
  canvas.height = Math.max(1, Math.floor(pixelCrop.height))

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  const dataUrl = canvas.toDataURL(fileType || "image/jpeg", 0.92)
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, fileType || "image/jpeg", 0.92)
  )

  if (!blob) {
    throw new Error("Cannot crop image")
  }

  return {
    file: new File([blob], fileName, { type: blob.type }),
    dataUrl,
  }
}

export function ImageCropDialog({
  open,
  file,
  title,
  aspect,
  cropShape = "rect",
  onOpenChange,
  onConfirm,
}: ImageCropDialogProps) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const imageSrc = React.useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  React.useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc)
    }
  }, [imageSrc])

  React.useEffect(() => {
    if (!open) return
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
  }, [open, file])

  const handleCropComplete = React.useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleApply = async () => {
    if (!file || !imageSrc || !croppedAreaPixels) return
    try {
      setSubmitting(true)
      const result = await getCroppedResult(
        imageSrc,
        croppedAreaPixels,
        file.name,
        file.type || "image/jpeg"
      )
      await onConfirm(result)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
          <div className="relative h-[340px] w-full">
            {imageSrc ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropShape={cropShape}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                showGrid={false}
              />
            ) : null}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium text-slate-700">{VI.profile.crop.zoom}</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-pink-500"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            {VI.common.actions.cancel}
          </Button>
          <Button type="button" size="sm" onClick={() => void handleApply()} disabled={submitting}>
            {submitting ? VI.common.status.loading : VI.profile.crop.apply}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
