import type { FormInstance } from "antd"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
            className="w-full rounded-full border-border text-foreground"
            disabled
          >
            {VI.common.actions.continueWithGoogle}{" "}
            <span className="text-muted-foreground">({VI.auth.register.googleComingSoon})</span>
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Separator />
          <span className="whitespace-nowrap">{VI.auth.register.continueWithForm}</span>
          <Separator />
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
