/**
 * Forgot Password Page
 *
 * Allows users to request a password reset email.
 */
import { useState } from "react"
import { Form, Input } from "antd"
import { Link } from "react-router-dom"
import { ArrowLeft, Mail } from "lucide-react"
import { AuthLayout } from "../layout/AuthLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmButton } from "../components/ConfirmButton"
import { forgotPassword } from "../api/auth.api"
import { VI } from "@/shared/i18n/vi"

export default function ForgotPasswordPage() {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: { email: string }) => {
    setSubmitting(true)
    setError(null)
    try {
      await forgotPassword(values.email)
      setSubmitted(true)
    } catch (err: any) {
      const msg = err?.response?.data?.message || VI.auth.forgotPassword.messages.sendError
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <AuthLayout variant="single">
        <Card className="w-full max-w-md rounded-2xl border-0 shadow-xl">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">{VI.auth.forgotPassword.successTitle}</h2>
            <p className="text-sm text-[#6B7280]">{VI.auth.forgotPassword.successMessage}</p>
            <Link to="/login">
              <Button className="mt-2">{VI.auth.forgotPassword.backToLogin}</Button>
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
            {VI.auth.forgotPassword.back}
          </Link>

          <h2 className="mb-1 text-2xl font-bold text-[#111827]">{VI.auth.forgotPassword.title}</h2>
          <p className="mb-6 text-sm text-[#6B7280]">{VI.auth.forgotPassword.subtitle}</p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-4">
            <Form.Item
              label={VI.auth.forgotPassword.emailLabel}
              name="email"
              rules={[
                { required: true, message: VI.auth.forgotPassword.validation.emailRequired },
                { type: "email", message: VI.auth.forgotPassword.validation.emailInvalid },
              ]}
            >
              <Input
                placeholder={VI.auth.forgotPassword.emailPlaceholder}
                size="large"
                prefix={<Mail className="h-4 w-4 text-[#9CA3AF]" />}
                className="h-11 rounded-full px-4"
              />
            </Form.Item>

            <ConfirmButton type="submit" label={VI.auth.forgotPassword.sendButton} loading={submitting} />
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
