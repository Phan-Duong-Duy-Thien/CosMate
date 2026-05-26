import { useEffect, useMemo, useState } from "react"
import { Button } from "antd"
import { CloseOutlined } from "@ant-design/icons"

import { POSE_SCORE_ASSETS } from "../constants/poseBattle.constants"
import type { PoseScoringResult } from "../types"

interface PoseResultOverlayProps {
  result: PoseScoringResult
  onClose: () => void
}

type ScoreTier = "perfect" | "veryGood" | "good" | "bad"

function getScoreTier(score: number): ScoreTier {
  if (score === 100) return "perfect"
  if (score >= 80) return "veryGood"
  if (score >= 50) return "good"
  return "bad"
}

function getResultVisual(score: number) {
  const tier = getScoreTier(score)

  if (tier === "perfect") {
    return { image: POSE_SCORE_ASSETS.perfect, tier }
  }
  if (tier === "veryGood") {
    return { image: POSE_SCORE_ASSETS.veryGood, tier }
  }
  if (tier === "good") {
    return { image: POSE_SCORE_ASSETS.good, tier }
  }
  return { image: POSE_SCORE_ASSETS.bad, tier }
}

function getScoreColor(score: number) {
  if (score >= 80) return "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text font-extrabold drop-shadow-md";
  if (score >= 50) return "text-amber-500 font-extrabold drop-shadow-sm";
  return "text-rose-500 font-extrabold drop-shadow-sm"; 
}

function getScorePositionClass(tier: ScoreTier) {
  if (tier === "veryGood") return "top-[65%]"
  if (tier === "good") return "top-[65%]"
  if (tier === "bad") return "top-[65%]"
  return "top-[65%]"
}

function cleanAiText(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```/g, ""))
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/`/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
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
  const cleanedComment = useMemo(() => cleanAiText(result.comment), [result.comment])
  const showScoreOnBoard = result.score !== 100

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-indigo-950/60 p-3 md:p-4">
      <div className="relative flex h-[90vh] w-full max-w-2xl flex-col rounded-[2rem] border-[4px] border-indigo-950 bg-[linear-gradient(180deg,#fffbeb_0%,#fff7ed_100%)] p-3 shadow-[10px_10px_0px_#fbcfe8] md:p-4">
        <button
          type="button"
          aria-label="Đóng kết quả"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full border-[3px] border-indigo-950 bg-fuchsia-200 p-2 text-indigo-950 transition hover:bg-fuchsia-300"
        >
          <CloseOutlined />
        </button>

        <h3 className="text-center text-2xl font-extrabold text-indigo-950">Kết quả Pose Battle</h3>

        <div className="relative mx-auto -mt-5 w-full max-w-[440px] overflow-hidden rounded-[1.5rem] border-[3px] border-indigo-950 bg-white shadow-[6px_6px_0px_#c4b5fd]">
          <img src={visual.image} alt="Pose result mascot" className="mx-auto -mt-5 h-[250px] w-auto object-contain md:h-[300px]" />

          {showScoreOnBoard && (
            <p
              className={[
                "pointer-events-none absolute left-[43%] -translate-x-1/2 -translate-y-1/2 text-4xl font-extrabold drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] md:text-5xl",
                getScoreColor(result.score),
                getScorePositionClass(visual.tier),
              ].join(" ")}
            >
              {displayScore}
            </p>
          )}
        </div>

        <div className="-mt-3 flex min-h-0 flex-1 flex-col rounded-[1.5rem] border-[3px] border-indigo-950 bg-white p-3 shadow-[6px_6px_0px_#fde68a] md:p-3.5">
          <p className="mb-2 text-sm font-extrabold text-indigo-950">Nhận xét từ AI</p>

          <div
            className="min-h-0 flex-1 overflow-y-auto pr-1 text-sm leading-6 text-slate-700 overscroll-contain whitespace-pre-wrap break-words"
            onWheel={(event) => event.stopPropagation()}
          >
            {cleanedComment}
          </div>
        </div>

        <Button
          type="primary"
          className="mt-3 !h-10 !rounded-2xl !border-[3px] !border-indigo-950 !bg-fuchsia-200 !font-extrabold !text-indigo-950 shadow-[4px_4px_0px_#312e81] hover:!bg-fuchsia-300"
          onClick={onClose}
        >
          Đóng
        </Button>
      </div>
    </div>
  )
}
