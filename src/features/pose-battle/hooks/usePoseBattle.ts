import { useMemo, useState } from "react"
import { notification } from "antd"

import { POSE_TIPS } from "../constants/poseBattle.constants"
import { mapPoseError, scorePose } from "../services/poseBattle.service"
import type { PoseScoringResult } from "../types"

export function usePoseBattle() {
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [characterName, setCharacterName] = useState("Naruto")
  const [userImageFile, setUserImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PoseScoringResult | null>(null)

  const randomTip = useMemo(() => {
    const idx = Math.floor(Math.random() * POSE_TIPS.length)
    return POSE_TIPS[idx]
  }, [loading])

  const submit = async () => {
    if (!userImageFile) {
      notification.warning({ message: "Vui lòng chụp hoặc tải ảnh của bạn trước khi chấm điểm." })
      return
    }

    setLoading(true)
    try {
      const response = await scorePose({
        image: userImageFile,
        characterName,
      })
      setResult(response)
    } catch (error) {
      notification.error({ message: mapPoseError(error) })
    } finally {
      setLoading(false)
    }
  }

  const closeResult = () => setResult(null)

  return {
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
  }
}
