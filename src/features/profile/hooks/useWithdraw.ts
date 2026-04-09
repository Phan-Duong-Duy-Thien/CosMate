import { useState, useCallback } from "react"
import { message } from "antd"
import { VI } from "@/shared/i18n/vi"
import * as withdrawService from "../services/withdraw.service"
import type { WithdrawPayload } from "../api/withdraw.api"

interface UseWithdrawResult {
  amount: string
  bankAccountNumber: string
  bankName: string
  loading: boolean
  error: string | null
  setAmount: (value: string) => void
  setBankAccountNumber: (value: string) => void
  setBankName: (value: string) => void
  handleSubmit: () => Promise<void>
}

export function useWithdraw(): UseWithdrawResult {
  const [amount, setAmount] = useState("")
  const [bankAccountNumber, setBankAccountNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async () => {
    const numAmount = parseFloat(amount)

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      message.error(VI.profile.wallet.withdrawValidationInvalidAmount)
      return
    }
    if (!bankAccountNumber.trim()) {
      message.error(VI.profile.wallet.withdrawValidationBankAccountRequired)
      return
    }
    if (!bankName.trim()) {
      message.error(VI.profile.wallet.withdrawValidationBankNameRequired)
      return
    }

    const payload: WithdrawPayload = {
      amount: numAmount,
      bankAccountNumber: bankAccountNumber.trim(),
      bankName: bankName.trim(),
    }

    setLoading(true)
    setError(null)
    try {
      await withdrawService.requestWithdraw(payload)
      message.success(VI.profile.wallet.withdrawSuccess)
    } catch (err) {
      console.error("Withdraw failed:", err)
      const errorMsg = err instanceof Error ? err.message : VI.profile.wallet.withdrawError
      setError(errorMsg)
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [amount, bankAccountNumber, bankName])

  return {
    amount,
    bankAccountNumber,
    bankName,
    loading,
    error,
    setAmount,
    setBankAccountNumber,
    setBankName,
    handleSubmit,
  }
}
