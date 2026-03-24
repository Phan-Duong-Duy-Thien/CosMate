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
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmButton } from "../components/ConfirmButton"
import { resetPassword } from "../api/auth.api"
import { VI } from "@/shared/i18n/vi"

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
    if (!token) {
      setError(VI.auth.resetPassword.messages.invalidToken)
      return
    }
    if (values.newPassword !== values.confirmPassword) {
      setError(VI.auth.resetPassword.messages.passwordMismatch)
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await resetPassword(token, values.newPassword)
      setSubmitted(true)
    } catch (err: any) {
      const msg = err?.response?.data?.message || VI.auth.resetPassword.messages.resetError
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout variant="single">
        <Card className="w-full max-w-md rounded-2xl border-0 shadow-xl">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <Lock className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">{VI.auth.resetPassword.invalidTokenTitle}</h2>
            <p className="text-sm text-[#6B7280]">{VI.auth.resetPassword.invalidTokenMessage}</p>
            <Link to="/login">
              <Button className="mt-2">{VI.auth.resetPassword.backToLogin}</Button>
            </Link>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  if (submitted) {
    return (
      <AuthLayout variant="single">
        <Card className="w-full max-w-md rounded-2xl border-0 shadow-xl">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Lock className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">{VI.auth.resetPassword.successTitle}</h2>
            <p className="text-sm text-[#6B7280]">{VI.auth.resetPassword.successMessage}</p>
            <Link to="/login">
              <Button className="mt-2">{VI.auth.resetPassword.goToLogin}</Button>
            </Link>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout variant="single">
      <Card className="w-full max-w-md rounded-2xl border-0 shadow-xl">
        <CardContent className="p-8">
          <Link
            to="/login"
            className="mb-6 flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#7C3AED]"
          >
            <ArrowLeft className="h-4 w-4" />
            {VI.auth.resetPassword.back}
          </Link>

          <h2 className="mb-1 text-2xl font-bold text-[#111827]">{VI.auth.resetPassword.title}</h2>
          <p className="mb-6 text-sm text-[#6B7280]">{VI.auth.resetPassword.subtitle}</p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

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
                prefix={<Lock className="h-4 w-4 text-[#9CA3AF]" />}
                className="h-11 rounded-full px-4"
              />
            </Form.Item>

            <Form.Item
              label={VI.auth.resetPassword.confirmPasswordLabel}
              name="confirmPassword"
              rules={[
                { required: true, message: VI.auth.resetPassword.validation.confirmRequired },
              ]}
            >
              <Input.Password
                placeholder={VI.auth.resetPassword.confirmPasswordPlaceholder}
                size="large"
                prefix={<Lock className="h-4 w-4 text-[#9CA3AF]" />}
                className="h-11 rounded-full px-4"
              />
            </Form.Item>

            <ConfirmButton type="submit" label={VI.auth.resetPassword.submitButton} loading={submitting} />
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
