import { useCallback, useEffect, useMemo, useState } from "react"
import { notification } from "antd"

import { POSE_TIPS } from "../constants/poseBattle.constants"
import {
  deletePoseHistory,
  getPoseHistory,
  mapPoseError,
  scorePose,
  updatePoseHistoryName,
} from "../services/poseBattle.service"
import { notifyTokenChanged } from "@/shared/sync/dataSync"
import type { PoseHistoryItem, PoseScoringResult } from "../types"

export type UsePoseBattleOptions = {
  assertCanUse?: () => boolean
  handleApiError?: (error: unknown) => boolean
}

export function usePoseBattle(options?: UsePoseBattleOptions) {
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [characterName, setCharacterName] = useState("")
  const [userImageFile, setUserImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PoseScoringResult | null>(null)

  const [historyLoading, setHistoryLoading] = useState(false)
  const [history, setHistory] = useState<PoseHistoryItem[]>([])
  const [searchKeyword, setSearchKeyword] = useState("")

  const randomTip = useMemo(() => {
    const idx = Math.floor(Math.random() * POSE_TIPS.length)
    return POSE_TIPS[idx]
  }, [loading])

  const loadHistory = useCallback(async (keyword?: string) => {
    setHistoryLoading(true)
    try {
      const response = await getPoseHistory(keyword)
      setHistory(response)
    } catch (error) {
      notification.error({ description: mapPoseError(error) })
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadHistory(searchKeyword)
  }, [loadHistory, searchKeyword])

  const submit = async () => {
    if (!userImageFile) {
      notification.warning({ description: "Vui lòng tải ảnh pose của bạn trước khi chấm điểm." })
      return
    }

    if (!characterName.trim()) {
      notification.warning({ description: "Vui lòng nhập tên nhân vật để AI chấm đúng ngữ cảnh." })
      return
    }

    if (options?.assertCanUse && !options.assertCanUse()) {
      return
    }

    setLoading(true)
    try {
      const response = await scorePose({
        image: userImageFile,
        characterName,
      })

      setResult(response)
      setReferenceImage(null)
      setUserImageFile(null)
      setCharacterName("")

      window.dispatchEvent(new Event('profile:refresh'))
      notifyTokenChanged()
      await loadHistory(searchKeyword)

      notification.success({ description: "Đã chấm điểm xong. Kết quả đã lưu vào lịch sử Pose Battle." })
    } catch (error) {
      if (options?.handleApiError?.(error)) return
      notification.error({ description: mapPoseError(error) })
    } finally {
      setLoading(false)
    }
  }

  const renameHistoryItem = async (id: number, newName: string) => {
    try {
      await updatePoseHistoryName(id, newName)
      notification.success({ description: "Đã cập nhật tên nhân vật thành công." })
      await loadHistory(searchKeyword)
    } catch (error) {
      notification.error({ description: mapPoseError(error) })
      throw error
    }
  }

  const removeHistoryItem = async (id: number) => {
    try {
      await deletePoseHistory(id)
      notification.success({ description: "Đã xóa lịch sử chấm điểm thành công." })
      await loadHistory(searchKeyword)
    } catch (error) {
      notification.error({ description: mapPoseError(error) })
      throw error
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
    searchKeyword,
    setSearchKeyword,
    submit,
    closeResult,
    reloadHistory: () => loadHistory(searchKeyword),
    renameHistoryItem,
    removeHistoryItem,
    setResult,
  }
}
