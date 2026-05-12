import { ChevronRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import registerHero from "@/assets/sakura-card.jpg"
import { Card } from "@/shared/components/Card"
import { AuthMarketingHero } from "../components/AuthMarketingHero"
import { AuthLayout } from "../layout/AuthLayout"
import { VI } from "@/shared/i18n/vi"
import { cn } from "@/lib/utils"

type RoleOption = {
  title: string
  description: string
  path: string
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    title: VI.auth.register.roleSelect.cosplayer.title,
    description: VI.auth.register.roleSelect.cosplayer.description,
    path: "/register/cosplayer",
  },
  {
    title: VI.auth.register.roleSelect.provider.title,
    description: VI.auth.register.roleSelect.provider.description,
    path: "/register/provider",
  },
  {
    title: VI.auth.register.roleSelect.staff.title,
    description: VI.auth.register.roleSelect.staff.description,
    path: "/register/staff",
  },
  {
    title: VI.auth.register.roleSelect.photographer.title,
    description: VI.auth.register.roleSelect.photographer.description,
    path: "/register/photographer",
  },
]

const roleCardClass =
  "h-full rounded-2xl border-[3px] border-indigo-950 bg-[#fffbeb] shadow-[5px_5px_0_0_rgba(30,27,75,0.28)] transition hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_rgba(236,72,153,0.35)] motion-safe:hover:-translate-y-0.5"

export default function RegisterRoleSelectPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout left={<AuthMarketingHero imageSrc={registerHero} imageAlt="Cosmate registration hero" />}>
      <div className="flex w-full flex-col justify-center gap-[clamp(16px,2vw,24px)] px-[clamp(24px,4vw,48px)] py-[clamp(24px,4vw,48px)]">
        <div className="space-y-2 text-center">
          <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-tight text-indigo-950">
            {VI.auth.register.roleSelect.title}
          </h1>
          <p className="text-sm font-medium text-indigo-900/75 sm:text-base">
            {VI.auth.register.roleSelect.subtitle}
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-2 sm:gap-6">
          {ROLE_OPTIONS.map((option) => (
            <button
              key={option.path}
              type="button"
              onClick={() => navigate(option.path)}
              className="group w-full text-left"
            >
              <Card className={cn(roleCardClass)}>
                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0 space-y-1">
                    <div className="text-base font-extrabold text-indigo-950">{option.title}</div>
                    <div className="text-sm font-medium text-indigo-900/80">{option.description}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-indigo-950/60" aria-hidden />
                </div>
              </Card>
            </button>
          ))}
        </div>

        <div className="text-center text-sm font-medium text-indigo-900/75">
          <span>
            {VI.auth.register.haveAccount}{" "}
            <Link to="/login" className="font-extrabold text-fuchsia-700 hover:text-fuchsia-800">
              {VI.auth.register.signIn}
            </Link>
          </span>
        </div>
      </div>
    </AuthLayout>
  )
}
