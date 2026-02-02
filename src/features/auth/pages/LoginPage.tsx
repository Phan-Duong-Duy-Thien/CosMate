import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

import loginHero from "@/assets/react.svg"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLogin } from "../hooks/useLogin"
import { AuthLayout } from "../layout/AuthLayout"
import { LoginForm } from "../components/LoginForm"

export default function LoginPage() {
  const { submitting, googleLoading, formError, handleEmailLogin, handleGoogleLogin } =
    useLogin()

  return (
    <AuthLayout
      left={
        <Card className="w-full max-w-[420px] overflow-hidden rounded-2xl border-0 shadow-xl">
          <CardContent className="p-0">
            <div className="aspect-4/5 w-full lg:aspect-3/4">
              <img
                src={loginHero}
                alt="Cosmate login hero"
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
            Welcome back to CosMate
          </h1>
          <p className="text-sm text-[#6B7280] sm:text-base">
            Login to continue your cosplay journey
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full border-[#E5E7EB] text-[#111827]"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Continue with Google
        </Button>

        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
          <Separator />
          <span className="whitespace-nowrap">Or continue with email</span>
          <Separator />
        </div>

        <LoginForm
          onSubmit={handleEmailLogin}
          submitting={submitting}
          formError={formError}
        />

        <div className="flex flex-col gap-2 text-center text-sm text-[#6B7280]">
          <Link
            to="/forgot-password"
            className="font-medium text-[#7C3AED] hover:text-[#6D28D9]"
          >
            Forgot password?
          </Link>
          <span>
            New here?{" "}
            <Link
              to="/register"
              className="font-medium text-[#7C3AED] hover:text-[#6D28D9]"
            >
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </AuthLayout>
  )
}
