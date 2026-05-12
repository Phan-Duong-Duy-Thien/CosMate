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
      <div className="w-full max-w-4xl rounded-3xl border-[4px] border-indigo-950 bg-[#fffbeb] p-[clamp(20px,4vw,40px)] shadow-[12px_12px_0_0_rgba(30,27,75,0.45)]">
        <div className="flex w-full flex-col gap-[clamp(16px,2vw,24px)]">
          <div className="space-y-2 text-center">
            <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-tight text-indigo-950">
              {VI.auth.onboarding.title}
            </h1>
            <p className="text-sm font-medium text-indigo-900/75 sm:text-base">
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
                  className={`group text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 ${isSelected ? "ring-4 ring-pink-400 ring-offset-2 ring-offset-[#fffbeb]" : ""}`}
                >
                  <div
                    className={`flex items-center justify-between gap-4 rounded-2xl border-[3px] bg-white p-4 shadow-[4px_4px_0_0_rgba(30,27,75,0.25)] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(236,72,153,0.3)] motion-safe:hover:-translate-y-0.5 ${isSelected ? "border-fuchsia-600" : "border-indigo-950/40"}`}
                  >
                    <div className="space-y-1">
                      <div className="text-base font-extrabold text-indigo-950">{option.title}</div>
                      <div className="text-sm font-medium text-indigo-900/75">{option.description}</div>
                    </div>
                    {isSelected ? (
                      <span className="rounded-lg border-[2px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 px-3 py-1 text-xs font-extrabold text-white shadow-[3px_3px_0_0_#1e1b4b]">
                        {VI.auth.onboarding.selected}
                      </span>
                    ) : (
                      <ChevronRight className="h-5 w-5 text-indigo-950/35" aria-hidden />
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
            className="w-full rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 py-3 text-sm font-extrabold text-white shadow-[6px_6px_0_0_#1e1b4b] transition hover:brightness-105 disabled:cursor-not-allowed disabled:border-indigo-950/30 disabled:bg-slate-200 disabled:bg-none disabled:text-slate-500 disabled:shadow-none"
          >
            {submitting ? VI.auth.onboarding.loading : VI.auth.onboarding.continue}
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}
