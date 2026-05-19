import * as React from "react"
import { isAuthenticated } from "@/features/auth/utils/authStorage"

export interface UserProfileState {
  avatarUrl: string | null
  fullName: string | null
}

interface UserProfileContextValue {
  userProfile: UserProfileState
  tokenBalance: number | null
  setUserProfile: (profile: Partial<UserProfileState>) => void
  setTokenBalance: (balance: number | null) => void
  refreshProfile: () => void
}

const STORAGE_KEY = "cosmate:userProfile"
const TOKEN_KEY = "cosmate:tokenBalance"

function getStoredProfile(): UserProfileState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return { avatarUrl: null, fullName: null }
}

function getStoredTokenBalance(): number | null {
  try {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored === null) return null
    const parsed = Number(stored)
    return Number.isFinite(parsed) ? parsed : null
  } catch {
    return null
  }
}

function storeProfile(profile: UserProfileState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // Ignore storage errors
  }
}

function storeTokenBalance(balance: number | null): void {
  try {
    if (balance === null || !Number.isFinite(balance)) localStorage.removeItem(TOKEN_KEY)
    else localStorage.setItem(TOKEN_KEY, String(balance))
  } catch {
    // Ignore storage errors
  }
}

const UserProfileContext = React.createContext<UserProfileContextValue | null>(null)

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfileState] = React.useState<UserProfileState>(() => getStoredProfile())
  const [tokenBalance, setTokenBalanceState] = React.useState<number | null>(() => getStoredTokenBalance())

  const setUserProfile = React.useCallback((profile: Partial<UserProfileState>) => {
    setUserProfileState((prev) => {
      const next = { ...prev, ...profile }
      storeProfile(next)
      return next
    })
  }, [])

  const setTokenBalance = React.useCallback((balance: number | ((prev: number | null) => number | null)) => {
    setTokenBalanceState((prev) => {
      const next = typeof balance === "function" ? balance(prev) : balance
      storeTokenBalance(next)
      return next
    })
  }, [])

  const refreshProfile = React.useCallback(() => {
    if (isAuthenticated()) {
      setUserProfileState({ avatarUrl: null, fullName: null })
      setTokenBalanceState(null)
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TOKEN_KEY)
      window.dispatchEvent(new Event("profile:refresh"))
    }
  }, [])

  React.useEffect(() => {
    const handleAuthChange = () => {
      if (isAuthenticated()) {
        refreshProfile()
      } else {
        setUserProfileState({ avatarUrl: null, fullName: null })
        setTokenBalanceState(null)
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(TOKEN_KEY)
      }
    }

    window.addEventListener("auth:changed", handleAuthChange)
    return () => window.removeEventListener("auth:changed", handleAuthChange)
  }, [refreshProfile])

  return (
    <UserProfileContext.Provider value={{ userProfile, tokenBalance, setUserProfile, setTokenBalance, refreshProfile }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile(): UserProfileContextValue {
  const context = React.useContext(UserProfileContext)
  if (!context) {
    throw new Error("useUserProfile must be used within UserProfileProvider")
  }
  return context
}
