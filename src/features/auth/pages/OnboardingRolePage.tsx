import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { message } from "antd"

import { AuthLayout } from "../layout/AuthLayout"
import { VI } from "@/shared/i18n/vi"
import { updateUserRole } from "../api/auth.api"
import { saveAuth, getAuth, decodeJwtPayload } from "../services/tokenStorage"
import { getRedirectPath } from "../utils/roleRedirect"

type RoleKey = "cosplayer" | "provider" | "staff" | "photographer"

const ROLE_MAP: Record<RoleKey, string> = {
  cosplayer: "COSPLAYER",
  provider: "PROVIDER_RENTAL",
  staff: "STAFF",
  photographer: "PROVIDER_PHOTOGRAPH",
}

const ROLE_OPTIONS: { key: RoleKey; title: string; description: string }[] = [
  {
    key: "cosplayer",
    title: VI.auth.onboarding.roleSelect.cosplayer.title,
    description: VI.auth.onboarding.roleSelect.cosplayer.description,
  },
  {
    key: "provider",
    title: VI.auth.onboarding.roleSelect.provider.title,
    description: VI.auth.onboarding.roleSelect.provider.description,
  },
  {
    key: "staff",
    title: VI.auth.onboarding.roleSelect.staff.title,
    description: VI.auth.onboarding.roleSelect.staff.description,
  },
  {
    key: "photographer",
    title: VI.auth.onboarding.roleSelect.photographer.title,
    description: VI.auth.onboarding.roleSelect.photographer.description,
  },
]

function reEncodeJwt(token: string, payload: Record<string, unknown>): string | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const header = parts[0]
    const signature = parts[2]
    const payloadStr = btoa(JSON.stringify(payload))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
    return `${header}.${payloadStr}.${signature}`
  } catch {
    return null
  }
}

export default function OnboardingRolePage() {
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleContinue = async () => {
    if (!selectedRole) {
      message.error(VI.auth.onboarding.validation.roleRequired)
      return
    }

    setSubmitting(true)
    try {
      const response = await updateUserRole(ROLE_MAP[selectedRole])

      if (response.code !== 0) {
        message.error(response.message || VI.auth.onboarding.messages.updateFailed)
        return
      }

      // Re-encode the JWT with the new role so getRoles() returns updated role
      const auth = getAuth()
      if (auth) {
        const payload = decodeJwtPayload(auth.token)
        if (payload) {
          const newPayload = {
            ...payload,
            roles: [ROLE_MAP[selectedRole]],
            role: ROLE_MAP[selectedRole],
          }
          const newToken = reEncodeJwt(auth.token, newPayload)
          if (newToken) {
            saveAuth({ token: newToken, tokenType: auth.tokenType }, true)
          }
        }
      }

      message.success(VI.auth.onboarding.successMessage)
      const redirectPath = getRedirectPath([ROLE_MAP[selectedRole]])
      navigate(redirectPath)
    } catch (error: any) {
      console.error("Role update error:", error)
      const errorMsg =
        error.response?.data?.message || VI.auth.onboarding.messages.updateFailed
      message.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout variant="single">
      <div className="w-full max-w-4xl rounded-3xl border border-white/40 bg-white/85 p-[clamp(20px,4vw,40px)] shadow-2xl">
        <div className="flex w-full flex-col gap-[clamp(16px,2vw,24px)]">
          <div className="space-y-2 text-center">
            <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-tight text-foreground">
              {VI.auth.onboarding.title}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {VI.auth.onboarding.subtitle}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {ROLE_OPTIONS.map((option) => {
              const isSelected = selectedRole === option.key
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSelectedRole(option.key)}
                  className={`group text-left transition ${isSelected ? "ring-2 ring-purple-500 ring-offset-2" : ""}`}
                >
                  <div className={`flex items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-sm transition group-hover:shadow-md ${isSelected ? "border-purple-500" : "border-gray-200"}`}>
                    <div className="space-y-1">
                      <div className="text-base font-semibold text-gray-900">
                        {option.title}
                      </div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                    {isSelected ? (
                      <span className="rounded-full bg-purple-500 px-3 py-1 text-xs font-medium text-white">
                        {VI.auth.onboarding.selected}
                      </span>
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedRole || submitting}
            className="w-full rounded-full py-3 text-sm font-semibold transition bg-purple-600 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {submitting ? VI.auth.onboarding.loading : VI.auth.onboarding.continue}
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}
