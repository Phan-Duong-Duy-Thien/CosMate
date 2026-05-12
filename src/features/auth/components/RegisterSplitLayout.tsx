import type { FormInstance } from "antd"
import { Link } from "react-router-dom"

import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"

import { AuthLayout } from "../layout/AuthLayout"
import type { RegisterFormValues } from "../types"
import { AuthMarketingHero } from "./AuthMarketingHero"
import { RegisterForm } from "./RegisterForm"

type RegisterSplitLayoutProps = {
  heroImage: string
  heroAlt: string
  title: string
  subtitle: string
  submitting: boolean
  formError?: string
  onRegister: (
    values: RegisterFormValues,
    form: FormInstance<RegisterFormValues>
  ) => void | Promise<void>
}

export function RegisterSplitLayout({
  heroImage,
  heroAlt,
  title,
  subtitle,
  submitting,
  formError,
  onRegister,
}: RegisterSplitLayoutProps) {
  return (
    <AuthLayout left={<AuthMarketingHero imageSrc={heroImage} imageAlt={heroAlt} />}>
      <div className="flex w-full flex-col justify-center gap-[clamp(16px,2vw,24px)] px-[clamp(24px,4vw,48px)] py-[clamp(24px,4vw,48px)]">
        <div className="space-y-2 text-center">
          <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl border-[3px] border-indigo-950/40 bg-[#fffbeb] font-semibold text-indigo-950 shadow-[4px_4px_0_0_rgba(30,27,75,0.2)]"
            disabled
          >
            {VI.common.actions.continueWithGoogle}{" "}
            <span className="text-indigo-900/60">({VI.auth.register.googleComingSoon})</span>
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-indigo-900/70">
          <div className="h-px min-w-0 flex-1 bg-indigo-950/20" aria-hidden />
          <span className="whitespace-nowrap">{VI.auth.register.continueWithForm}</span>
          <div className="h-px min-w-0 flex-1 bg-indigo-950/20" aria-hidden />
        </div>

        <RegisterForm onSubmit={onRegister} submitting={submitting} formError={formError} />

        <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
          <Link to="/register" className="font-medium text-primary hover:text-primary/90">
            {VI.auth.register.chooseOtherRole}
          </Link>
          <span>
            {VI.auth.register.haveAccount}{" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary/90">
              {VI.auth.register.signIn}
            </Link>
          </span>
        </div>
      </div>
    </AuthLayout>
  )
}
