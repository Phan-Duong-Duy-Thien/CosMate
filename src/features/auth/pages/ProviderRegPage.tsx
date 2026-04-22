import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

import registerHero from "@/assets/sakura-card.jpg"
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
        <Card className="h-full w-full overflow-hidden rounded-none border-0 shadow-xl">
          <CardContent className="relative h-full p-0">
            <img
              src={registerHero}
              alt="Cosmate registration hero"
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
            Tạo tài khoản nhà cung cấp trang phục 
          </h1>
          <p className="text-sm text-[#6B7280] sm:text-base">
            Tham gia nền tảng của chúng tôi với vai trò nhà cung cấp trang phục và bắt đầu đăng thuê các trang phục của bạn.
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
        </div>

        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
          <Separator />
          <span className="whitespace-nowrap">Hoặc tiếp tục đăng ký với tên tài khoản</span>
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
