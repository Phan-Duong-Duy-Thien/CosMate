/**
 * Reset Password Page
 *
 * Allows users to set a new password using a token from email.
 * URL: /reset-password?token=xxx
 */
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Form, Input } from "antd"
import { Link } from "react-router-dom"
import { ArrowLeft, Lock } from "lucide-react"
import { AuthLayout } from "../layout/AuthLayout"
import { Card } from "@/shared/components/Card"
import { Button } from "@/shared/components/Button"
import { ConfirmButton } from "../components/ConfirmButton"
import { useResetPassword } from "../hooks/useResetPassword"
import { VI } from "@/shared/i18n/vi"
import { cn } from "@/lib/utils"

const authCardClass =
  "w-full max-w-md rounded-3xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[10px_10px_0_0_rgba(30,27,75,0.45)]"

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [form] = Form.useForm()
  const [submitted, setSubmitted] = useState(false)
  const { submitting, submit } = useResetPassword()

  const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      form.setFields([{ name: "confirmPassword", errors: [VI.auth.resetPassword.messages.passwordMismatch] }])
      return
    }

    if (!token) {
      form.setFields([{ name: "newPassword", errors: [VI.auth.resetPassword.messages.invalidToken] }])
      return
    }

    const ok = await submit(token, values.newPassword)
    if (ok) {
      setSubmitted(true)
    }
  }

  if (!token) {
    return (
      <AuthLayout variant="single">
        <Card className={cn(authCardClass)}>
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-red-100 shadow-[4px_4px_0_0_#1e1b4b]">
              <Lock className="h-8 w-8 text-red-600" aria-hidden />
            </div>
            <h2 className="text-xl font-extrabold text-indigo-950">{VI.auth.resetPassword.invalidTokenTitle}</h2>
            <p className="text-sm font-medium text-indigo-900/80">{VI.auth.resetPassword.invalidTokenMessage}</p>
            <Link to="/login">
              <Button
                variant="outline"
                className="mt-2 rounded-xl border-[3px] border-indigo-950 bg-white font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] hover:bg-pink-100"
              >
                {VI.auth.resetPassword.backToLogin}
              </Button>
            </Link>
          </div>
        </Card>
      </AuthLayout>
    )
  }

  if (submitted) {
    return (
      <AuthLayout variant="single">
        <Card className={cn(authCardClass)}>
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-emerald-100 shadow-[4px_4px_0_0_#1e1b4b]">
              <Lock className="h-8 w-8 text-emerald-700" aria-hidden />
            </div>
            <h2 className="text-xl font-extrabold text-indigo-950">{VI.auth.resetPassword.successTitle}</h2>
            <p className="text-sm font-medium text-indigo-900/80">{VI.auth.resetPassword.successMessage}</p>
            <Link to="/login">
              <Button
                variant="outline"
                className="mt-2 rounded-xl border-[3px] border-indigo-950 bg-white font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] hover:bg-pink-100"
              >
                {VI.auth.resetPassword.goToLogin}
              </Button>
            </Link>
          </div>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout variant="single">
      <Card className={cn(authCardClass)}>
        <div className="p-8">
          <Link
            to="/login"
            className="mb-6 flex items-center gap-1 text-sm font-semibold text-indigo-800/80 hover:text-fuchsia-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {VI.auth.resetPassword.back}
          </Link>

          <h2 className="mb-1 text-2xl font-extrabold text-indigo-950">{VI.auth.resetPassword.title}</h2>
          <p className="mb-6 text-sm font-medium text-indigo-900/75">{VI.auth.resetPassword.subtitle}</p>

          <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-4">
            <Form.Item
              label={VI.auth.resetPassword.newPasswordLabel}
              name="newPassword"
              rules={[
                { required: true, message: VI.auth.resetPassword.validation.passwordRequired },
                { min: 6, message: VI.auth.resetPassword.validation.passwordMinLength },
              ]}
            >
              <Input.Password
                placeholder={VI.auth.resetPassword.newPasswordPlaceholder}
                size="large"
                prefix={<Lock className="h-4 w-4 text-indigo-900/50" aria-hidden />}
                className="h-11 rounded-xl border-[2px] border-indigo-950/25 px-4"
              />
            </Form.Item>

            <Form.Item
              label={VI.auth.resetPassword.confirmPasswordLabel}
              name="confirmPassword"
              rules={[{ required: true, message: VI.auth.resetPassword.validation.confirmRequired }]}
            >
              <Input.Password
                placeholder={VI.auth.resetPassword.confirmPasswordPlaceholder}
                size="large"
                prefix={<Lock className="h-4 w-4 text-indigo-900/50" aria-hidden />}
                className="h-11 rounded-xl border-[2px] border-indigo-950/25 px-4"
              />
            </Form.Item>

            <ConfirmButton type="submit" label={VI.auth.resetPassword.submitButton} loading={submitting} />
          </Form>
        </div>
      </Card>
    </AuthLayout>
  )
}
