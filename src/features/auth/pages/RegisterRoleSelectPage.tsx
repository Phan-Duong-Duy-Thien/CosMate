import { ChevronRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import registerHero from "@/assets/sakura-card.jpg"
import { Card, CardContent } from "@/components/ui/card"
import { AuthMarketingHero } from "../components/AuthMarketingHero"
import { AuthLayout } from "../layout/AuthLayout"
import { VI } from "@/shared/i18n/vi"

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

export default function RegisterRoleSelectPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout left={<AuthMarketingHero imageSrc={registerHero} imageAlt="Cosmate registration hero" />}>
      <div className="flex w-full flex-col justify-center gap-[clamp(16px,2vw,24px)] px-[clamp(24px,4vw,48px)] py-[clamp(24px,4vw,48px)]">
        <div className="space-y-2 text-center">
          <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-tight text-foreground">
            {VI.auth.register.roleSelect.title}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">{VI.auth.register.roleSelect.subtitle}</p>
        </div>

        <div className="mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-2 sm:gap-6">
          {ROLE_OPTIONS.map((option) => (
            <button
              key={option.path}
              type="button"
              onClick={() => navigate(option.path)}
              className="group w-full text-left"
            >
              <Card className="h-full border-border shadow-sm transition group-hover:shadow-md">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0 space-y-1">
                    <div className="text-base font-semibold text-foreground">{option.title}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
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
