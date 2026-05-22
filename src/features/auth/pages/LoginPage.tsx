import { useCallback, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"

import loginHero from "@/assets/saukura.jpg"
import { useLogin } from "../hooks/useLogin"
import { AuthLayout } from "../layout/AuthLayout"
import { AuthMarketingHero } from "../components/AuthMarketingHero"
import { LoginForm } from "../components/LoginForm"
import { LoginMethodTabs, type LoginMethod } from "../components/LoginMethodTabs"
import { QrLoginPanel } from "../components/QrLoginPanel"
import { getRedirectPath } from "../utils/roleRedirect"
import type { LoginFormValues } from "../types"
import { VI } from "@/shared/i18n/vi"
import { useUserProfile } from "@/app/providers/UserProfileProvider"
import { isAuthenticated } from "../utils/authStorage"

export default function LoginPage() {
  const { submitting, formError, handleEmailLogin } = useLogin()
  const navigate = useNavigate()
  const { refreshProfile } = useUserProfile()
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email")

  const completeLogin = useCallback(
    (roles: string[]) => {
      refreshProfile()
      navigate(getRedirectPath(roles))
    },
    [navigate, refreshProfile]
  )

  const onLoginSubmit = async (values: LoginFormValues) => {
    const roles = await handleEmailLogin(values)

    if (roles) {
      completeLogin(roles)
    }
  }

  const onQrApproved = useCallback(
    (roles: string[]) => {
      completeLogin(roles)
    },
    [completeLogin]
  )

  if (isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  return (
    <AuthLayout left={<AuthMarketingHero imageSrc={loginHero} imageAlt="Cosmate login hero" />}>
      <div className="flex w-full flex-col justify-center gap-[clamp(16px,2vw,24px)] px-[clamp(24px,4vw,48px)] py-[clamp(24px,4vw,48px)]">
        <div className="space-y-2 text-center">
          <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-tight text-foreground">
            {VI.auth.login.title}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {VI.auth.login.subtitle}
          </p>
        </div>

        <LoginMethodTabs
          value={loginMethod}
          onChange={setLoginMethod}
          disabled={submitting}
        />

        {loginMethod === "email" ? (
          <LoginForm
            onSubmit={onLoginSubmit}
            submitting={submitting}
            formError={formError}
          />
        ) : (
          <QrLoginPanel active={loginMethod === "qr"} onApproved={onQrApproved} />
        )}

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
