import { useCallback, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"

import loginHero from "@/assets/saukura.jpg"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLogin } from "../hooks/useLogin"
import { AuthLayout } from "../layout/AuthLayout"
import { LoginForm } from "../components/LoginForm"
import { getRedirectPath } from "../utils/roleRedirect"
import type { LoginFormValues } from "../types"
import { VI } from "@/shared/i18n/vi"
import { useUserProfile } from "@/app/providers/UserProfileProvider"

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: IdConfiguration) => void
          renderButton: (element: HTMLElement, config: GButtonConfig) => void
          prompt: () => void
        }
      }
    }
  }
}

interface IdConfiguration {
  client_id: string
  callback: (response: CredentialResponse) => void
  auto_select?: boolean
  context?: string
  itp_support?: boolean
  cancel_on_tap_outside?: boolean
}

interface GButtonConfig {
  type?: "standard" | "icon"
  theme?: "outline" | "filled_blue" | "filled_black"
  size?: "small" | "medium" | "large"
  text?: "signin_with" | "signup_with" | "continue_with" | "signin"
  shape?: "rectangular" | "pill" | "circle" | "square"
  logo_alignment?: "left" | "center"
  width?: number
}

interface CredentialResponse {
  credential?: string
  select_by?: string
  error?: string
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

function loadGoogleSdk(): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.accounts?.id) {
      resolve()
      return
    }
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

export default function LoginPage() {
  const { submitting, googleLoading, formError, handleEmailLogin, handleGoogleLogin } = useLogin()
  const navigate = useNavigate()
  const { refreshProfile } = useUserProfile()
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn("VITE_GOOGLE_CLIENT_ID is not set – Google login will be disabled")
      return
    }
    loadGoogleSdk().then(() => {
      if (initializedRef.current) return
      initializedRef.current = true
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: CredentialResponse) => {
          if (response.error) {
            console.error("Google Sign-In error:", response.error)
            return
          }
          if (!response.credential) {
            console.error("No credential in Google response")
            return
          }
          const idToken = response.credential
          const roles = await handleGoogleLogin(idToken)
          if (roles) {
            refreshProfile()
            const redirectPath = getRedirectPath(roles)
            navigate(redirectPath)
          }
        },
        context: "signin",
      })
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          width: 400,
        })
      }
    })
  }, [handleGoogleLogin, navigate, refreshProfile])

  const onLoginSubmit = async (values: LoginFormValues) => {
    const roles = await handleEmailLogin(values)

    if (roles) {
      refreshProfile()
      const redirectPath = getRedirectPath(roles)
      navigate(redirectPath)
    }
  }

  return (
    <AuthLayout
      left={
        <Card className="h-full w-full overflow-hidden rounded-none border-0 shadow-xl">
          <CardContent className="relative p-0 h-full">
            <img
              src={loginHero}
              alt="Cosmate login hero"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4 rounded-2xl bg-white/90 px-3 py-2 text-xs shadow-md">
              <div className="font-semibold text-foreground">{VI.common.appName}</div>
              <div className="text-[11px] text-muted-foreground">Tìm nhân vật của bạn</div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 px-4 py-3 text-xs shadow-md">
              <div className="grid grid-cols-3 gap-2 text-center text-muted-foreground">
                <div>
                  <div className="text-sm font-semibold text-primary">5K+</div>
                  {VI.auth.login.stats.costumes}
                </div>
                <div>
                  <div className="text-sm font-semibold text-cosmate-pink">2K+</div>
                  {VI.auth.login.stats.users}
                </div>
                <div>
                  <div className="text-sm font-semibold text-cosmate-success">500+</div>
                  {VI.auth.login.stats.rentals}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <div className="flex w-full flex-col justify-center gap-[clamp(16px,2vw,24px)] px-[clamp(24px,4vw,48px)] py-[clamp(24px,4vw,48px)]">
        <div className="space-y-2 text-center">
          <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-tight text-foreground">
            {VI.auth.login.title}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {VI.auth.login.subtitle}
          </p>
        </div>

        {GOOGLE_CLIENT_ID ? (
          <div ref={googleButtonRef} className="flex justify-center" />
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full border-border text-foreground"
            disabled
          >
            {VI.common.actions.continueWithGoogle} (not configured)
          </Button>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Separator />
          <span className="whitespace-nowrap">{VI.common.actions.continueWithEmail}</span>
          <Separator />
        </div>

        <LoginForm
          onSubmit={onLoginSubmit}
          submitting={submitting}
          formError={formError}
        />

        <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
          <Link
            to="/forgot-password"
            className="font-medium text-primary hover:text-primary/90"
          >
            {VI.auth.login.forgotPassword}
          </Link>
          <span>
            {VI.auth.login.noAccount}{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/90"
            >
              {VI.auth.login.signUp}
            </Link>
          </span>
        </div>
      </div>
    </AuthLayout>
  )
}
