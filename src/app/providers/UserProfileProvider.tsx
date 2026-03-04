import * as React from "react"

export interface UserProfileState {
  avatarUrl: string | null
  fullName: string | null
}

interface UserProfileContextValue {
  userProfile: UserProfileState
  setUserProfile: (profile: Partial<UserProfileState>) => void
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

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
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
