import { useCallback, useEffect, useState } from "react"
import { getUserId } from "@/features/auth/services/tokenStorage"
import type { WalletInfo, WalletTransaction } from "../types"
import * as walletService from "../services/wallet.service"
import { useDataSyncRefetch } from "@/shared/hooks/useDataSyncRefetch"
import { DATA_SYNC_EVENTS } from "@/shared/sync/dataSync"

interface UseWalletResult {
  // Data
  walletInfo: WalletInfo | null
  transactions: WalletTransaction[]

  // Loading states
  loadingWallet: boolean
  loadingTransactions: boolean

  // UI state
  isTransactionsOpen: boolean
  error: string | null

  // Actions
  toggleTransactions: () => void
  fetchTransactionsIfNeeded: () => Promise<void>
  refetchWallet: () => Promise<void>
}

export function useWallet(): UseWalletResult {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loadingWallet, setLoadingWallet] = useState(false)
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transactionsLoaded, setTransactionsLoaded] = useState(false)

  const userId = getUserId()

  const fetchWalletInfo = useCallback(async () => {
    if (!userId) {
      setError("User not found")
      return
    }

    try {
      setLoadingWallet(true)
      setError(null)
      const result = await walletService.fetchWalletInfo(userId)
      setWalletInfo(result)
    } catch {
      setError("Failed to load wallet information")
    } finally {
      setLoadingWallet(false)
    }
  }, [userId])

  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      setError("User not found")
      return
    }

    try {
      setLoadingTransactions(true)
      setError(null)
      const result = await walletService.fetchWalletTransactions(userId)
      setTransactions(result)
      setTransactionsLoaded(true)
    } catch {
      setError("Failed to load transactions")
    } finally {
      setLoadingTransactions(false)
    }
  }, [userId])

  // Fetch wallet info on mount
  useEffect(() => {
    void fetchWalletInfo()
  }, [fetchWalletInfo])

  useDataSyncRefetch(fetchWalletInfo, DATA_SYNC_EVENTS.WALLET_CHANGED, Boolean(userId))

  const toggleTransactions = useCallback(() => {
    setIsTransactionsOpen((prev) => !prev)
  }, [])

  const fetchTransactionsIfNeeded = useCallback(async () => {
    if (!transactionsLoaded && !loadingTransactions) {
      await fetchTransactions()
    }
  }, [transactionsLoaded, loadingTransactions, fetchTransactions])

  const refetchWallet = useCallback(async () => {
    await fetchWalletInfo()
  }, [fetchWalletInfo])

  return {
    walletInfo,
    transactions,
    loadingWallet,
    loadingTransactions,
    isTransactionsOpen,
    error,
    toggleTransactions,
    fetchTransactionsIfNeeded,
    refetchWallet,
  }
}
