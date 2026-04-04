import { forwardRef } from "react"
import { Button } from "antd"

interface StyleResultCardProps {
  text: string
  onSaveImage: () => void
}

const StyleResultCard = forwardRef<HTMLDivElement, StyleResultCardProps>(function StyleResultCard(
  { text, onSaveImage },
  ref
) {
  return (
    <section className="space-y-4">
      <div
        ref={ref}
        className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-violet-700 via-fuchsia-700 to-pink-600 p-6 text-white shadow-xl"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <p className="text-xs uppercase tracking-[0.2em] text-white/80">Tarot Style Card</p>
        <h3 className="mt-2 text-2xl font-bold">Arcana Cosplay</h3>
        <p className="mt-4 leading-relaxed text-white/95">{text}</p>
      </div>

      <Button onClick={onSaveImage} className="rounded-full" type="primary">
        Lưu thẻ về máy
      </Button>
    </section>
  )
})

export default StyleResultCard
