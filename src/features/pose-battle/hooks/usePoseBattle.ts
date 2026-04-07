import { useEffect, useMemo, useState } from "react"
import { notification } from "antd"

import { POSE_TIPS } from "../constants/poseBattle.constants"
import { getPoseHistory, mapPoseError, scorePose } from "../services/poseBattle.service"
import type { PoseHistoryItem, PoseScoringResult } from "../types"

export function usePoseBattle() {
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [characterName, setCharacterName] = useState("")
  const [userImageFile, setUserImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PoseScoringResult | null>(null)

  const [historyLoading, setHistoryLoading] = useState(false)
  const [history, setHistory] = useState<PoseHistoryItem[]>([])

  const randomTip = useMemo(() => {
    const idx = Math.floor(Math.random() * POSE_TIPS.length)
    return POSE_TIPS[idx]
  }, [loading])

  const loadHistory = async () => {
    setHistoryLoading(true)
    try {
      const response = await getPoseHistory()
      setHistory(response)
    } catch (error) {
      notification.error({ message: mapPoseError(error) })
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    void loadHistory()
  }, [])

  const submit = async () => {
    if (!userImageFile) {
      notification.warning({ message: "Vui lòng tải ảnh pose của bạn trước khi chấm điểm." })
      return
    }

    if (!characterName.trim()) {
      notification.warning({ message: "Vui lòng nhập tên nhân vật để AI chấm đúng ngữ cảnh." })
      return
    }

    setLoading(true)
    try {
      const response = await scorePose({
        image: userImageFile,
        characterName,
      })
      setResult(response)
      notification.success({ message: "Đã chấm điểm xong và lưu vào lịch sử." })
      await loadHistory()
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
    history,
    historyLoading,
    submit,
    closeResult,
    reloadHistory: loadHistory,
    setResult,
  }
}
