import { useEffect, useMemo, useState } from "react"
import { Button } from "antd"

import { POSE_SCORE_ASSETS } from "../constants/poseBattle.constants"
import type { PoseScoringResult } from "../types"

interface PoseResultOverlayProps {
  result: PoseScoringResult
  onClose: () => void
}

function getResultVisual(score: number) {
  if (score === 100) {
    return { image: POSE_SCORE_ASSETS.perfect, color: "text-fuchsia-500" }
  }
  if (score >= 80) {
    return { image: POSE_SCORE_ASSETS.veryGood, color: "text-green-500" }
  }
  if (score >= 50) {
    return { image: POSE_SCORE_ASSETS.good, color: "text-yellow-500" }
  }
  return { image: POSE_SCORE_ASSETS.bad, color: "text-red-500" }
}

export default function PoseResultOverlay({ result, onClose }: PoseResultOverlayProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let current = 0
    const target = result.score
    const step = Math.max(1, Math.ceil(target / 30))

    const timer = window.setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        window.clearInterval(timer)
      }
      setDisplayScore(current)
    }, 30)

    return () => window.clearInterval(timer)
  }, [result.score])

  const visual = useMemo(() => getResultVisual(result.score), [result.score])

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 text-center shadow-2xl">
        <h3 className="text-xl font-bold text-slate-800">Kết quả Pose Battle</h3>
        <img src={visual.image} alt="Pose result mascot" className="mx-auto mt-4 h-44 w-44 object-contain" />

        <p className={`mt-2 text-5xl font-extrabold ${visual.color}`}>{displayScore}</p>

        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{result.comment}</p>

        <Button type="primary" className="mt-5 rounded-full" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </div>
  )
}
