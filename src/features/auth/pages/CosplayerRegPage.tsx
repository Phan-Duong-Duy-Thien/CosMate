import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

import registerHero from "@/assets/react.svg"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRegister } from "../hooks/useRegister"
import { AuthLayout } from "../layout/AuthLayout"
import { RegisterForm } from "../components/RegisterForm"

export default function CosplayerRegPage() {
  const { submitting, formError, handleRegister } = useRegister()

  return (
    <AuthLayout
      left={
        <Card className="w-full max-w-[420px] overflow-hidden rounded-2xl border-0 shadow-xl">
          <CardContent className="p-0">
            <div className="aspect-4/5 w-full lg:aspect-3/4">
              <img
                src={registerHero}
                alt="Cosmate registration hero"
                className="h-full w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      }
    >
      <div className="flex w-full max-w-[520px] flex-col justify-center space-y-5 md:space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-tight text-[#111827]">
            Create your CosMate account
          </h1>
          <p className="text-sm text-[#6B7280] sm:text-base">
            Join the community and start your cosplay journey.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full border-[#E5E7EB] text-[#111827]"
          disabled={submitting}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Continue with Google
        </Button>

        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
          <Separator />
          <span className="whitespace-nowrap">Or continue with email</span>
          <Separator />
        </div>

        <RegisterForm onSubmit={handleRegister} submitting={submitting} formError={formError} />

        <div className="flex flex-col gap-2 text-center text-sm text-[#6B7280]">
          <span>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#7C3AED] hover:text-[#6D28D9]"
            >
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </AuthLayout>
  )
}
