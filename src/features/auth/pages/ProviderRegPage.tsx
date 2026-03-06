import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

import registerHero from "@/assets/react.svg"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ROLE } from "@/types/auth"
import { VI } from "@/shared/i18n/vi"
import { useRegister } from "../hooks/useRegister"
import { AuthLayout } from "../layout/AuthLayout"
import { RegisterForm } from "../components/RegisterForm"

export default function ProviderRegPage() {
  const { submitting, formError, handleRegister } = useRegister(ROLE.PROVIDER_RENTAL)

  return (
    <AuthLayout
      left={
        <Card className="w-full max-w-[420px] overflow-hidden rounded-2xl border-0 shadow-xl">
          <CardContent className="p-0">
            <div className="relative aspect-4/5 w-full lg:aspect-3/4">
              <img
                src={registerHero}
                alt="Cosmate registration hero"
                className="h-full w-full object-cover"
              />
              <div className="absolute left-4 top-4 rounded-2xl bg-white/90 px-3 py-2 text-xs shadow-md">
                <div className="font-semibold text-[#111827]">CosMate</div>
                <div className="text-[11px] text-[#6B7280]">Find Your Character</div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 px-4 py-3 text-xs shadow-md">
                <div className="grid grid-cols-3 gap-2 text-center text-[#6B7280]">
                  <div>
                    <div className="text-sm font-semibold text-[#7C3AED]">5K+</div>
                    Costumes
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#EC4899]">2K+</div>
                    Users
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#10B981]">500+</div>
                    Rentals
                  </div>
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
            Create Rental Provider Account
          </h1>
          <p className="text-sm text-[#6B7280] sm:text-base">
            Join as a costume rental provider and start listing your rentals.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full border-[#E5E7EB] text-[#111827]"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#E5E7EB] text-[11px] font-semibold">
                G
              </span>
            )}
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full border-[#E5E7EB] text-[#111827]"
            disabled={submitting}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#E5E7EB] text-[11px] font-semibold">
              f
            </span>
            Continue with Facebook
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
          <Separator />
          <span className="whitespace-nowrap">Or continue with email</span>
          <Separator />
        </div>

        <RegisterForm onSubmit={handleRegister} submitting={submitting} formError={formError} />

        <div className="flex flex-col gap-2 text-center text-sm text-[#6B7280]">
          <span>
            {VI.auth.register.haveAccount}{" "}
            <Link
              to="/login"
              className="font-medium text-[#7C3AED] hover:text-[#6D28D9]"
            >
              {VI.auth.register.signIn}
            </Link>
          </span>
        </div>
      </div>
    </AuthLayout>
  )
}
