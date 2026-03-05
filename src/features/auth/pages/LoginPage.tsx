import { Loader2 } from "lucide-react"
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

export default function LoginPage() {
  const { submitting, googleLoading, formError, handleEmailLogin, handleGoogleLogin } = useLogin()
  const navigate = useNavigate()
  const { refreshProfile } = useUserProfile()

  const onLoginSubmit = async (values: LoginFormValues) => {
    const roles = await handleEmailLogin(values)
    
    if (roles) {
      refreshProfile()
      const redirectPath = getRedirectPath(roles)
      console.log("🔐 Redirecting user to:", redirectPath)
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
              <div className="font-semibold text-[#111827]">{VI.common.appName}</div>
              <div className="text-[11px] text-[#6B7280]">Tìm nhân vật của bạn</div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 px-4 py-3 text-xs shadow-md">
              <div className="grid grid-cols-3 gap-2 text-center text-[#6B7280]">
                <div>
                  <div className="text-sm font-semibold text-[#7C3AED]">5K+</div>
                  {VI.auth.login.stats.costumes}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#EC4899]">2K+</div>
                  {VI.auth.login.stats.users}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#10B981]">500+</div>
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
          <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-tight text-[#111827]">
            {VI.auth.login.title}
          </h1>
          <p className="text-sm text-[#6B7280] sm:text-base">
            {VI.auth.login.subtitle}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full border-[#E5E7EB] text-[#111827]"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#E5E7EB] text-[11px] font-semibold">
                G
              </span>
            )}
            {VI.common.actions.continueWithGoogle}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full border-[#E5E7EB] text-[#111827]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#E5E7EB] text-[11px] font-semibold">
              f
            </span>
            {VI.common.actions.continueWithFacebook}
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
          <Separator />
          <span className="whitespace-nowrap">{VI.common.actions.continueWithEmail}</span>
          <Separator />
        </div>

        <LoginForm
          onSubmit={onLoginSubmit}
          submitting={submitting}
          formError={formError}
        />

        <div className="flex flex-col gap-2 text-center text-sm text-[#6B7280]">
          <Link
            to="/forgot-password"
            className="font-medium text-[#7C3AED] hover:text-[#6D28D9]"
          >
            {VI.auth.login.forgotPassword}
          </Link>
          <span>
            {VI.auth.login.noAccount}{" "}
            <Link
              to="/register"
              className="font-medium text-[#7C3AED] hover:text-[#6D28D9]"
            >
              {VI.auth.login.signUp}
            </Link>
          </span>
        </div>
      </div>
    </AuthLayout>
  )
}
