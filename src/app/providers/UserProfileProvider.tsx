import * as React from "react"
import { isAuthenticated } from "@/features/auth/utils/authStorage"

export interface UserProfileState {
  avatarUrl: string | null
  fullName: string | null
}

interface UserProfileContextValue {
  userProfile: UserProfileState
  setUserProfile: (profile: Partial<UserProfileState>) => void
  refreshProfile: () => void
}

const STORAGE_KEY = "cosmate:userProfile"

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

function storeProfile(profile: UserProfileState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // Ignore storage errors
  }
}

const UserProfileContext = React.createContext<UserProfileContextValue | null>(null)

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfileState] = React.useState<UserProfileState>(() => getStoredProfile())

  const setUserProfile = React.useCallback((profile: Partial<UserProfileState>) => {
    setUserProfileState((prev) => {
      const next = { ...prev, ...profile }
      storeProfile(next)
      return next
    })
  }, [])

  // Function to refresh profile - called after login
  const refreshProfile = React.useCallback(() => {
    // Clear stored profile on login so it will be fetched fresh
    if (isAuthenticated()) {
      setUserProfileState({ avatarUrl: null, fullName: null })
      localStorage.removeItem(STORAGE_KEY)
      // Dispatch event to trigger profile fetch in components
      window.dispatchEvent(new Event("profile:refresh"))
    }
  }, [])

  // Listen for auth changes to refresh profile
  React.useEffect(() => {
    const handleAuthChange = () => {
      if (isAuthenticated()) {
        refreshProfile()
      } else {
        // User logged out, clear profile
        setUserProfileState({ avatarUrl: null, fullName: null })
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    window.addEventListener("auth:changed", handleAuthChange)
    return () => window.removeEventListener("auth:changed", handleAuthChange)
  }, [refreshProfile])

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile, refreshProfile }}>
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
