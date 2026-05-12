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
import { Card } from "@/shared/components/Card"
import { Button } from "@/shared/components/Button"
import { ConfirmButton } from "../components/ConfirmButton"
import { useForgotPasswordRequest } from "../hooks/useForgotPasswordRequest"
import { VI } from "@/shared/i18n/vi"
import { cn } from "@/lib/utils"

const authCardClass =
  "w-full max-w-md rounded-3xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[10px_10px_0_0_rgba(30,27,75,0.45)]"

export default function ForgotPasswordPage() {
  const [form] = Form.useForm()
  const [submitted, setSubmitted] = useState(false)
  const { submitting, submit } = useForgotPasswordRequest()

  const handleSubmit = async (values: { identifier: string }) => {
    const ok = await submit(values.identifier)
    if (ok) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <AuthLayout variant="single">
        <Card className={cn(authCardClass)}>
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-emerald-100 shadow-[4px_4px_0_0_#1e1b4b]">
              <Mail className="h-8 w-8 text-emerald-700" aria-hidden />
            </div>
            <h2 className="text-xl font-extrabold text-indigo-950">{VI.auth.forgotPassword.successTitle}</h2>
            <p className="text-sm font-medium text-indigo-900/80">{VI.auth.forgotPassword.successMessage}</p>
            <Link to="/login">
              <Button
                variant="outline"
                className="mt-2 rounded-xl border-[3px] border-indigo-950 bg-white font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] hover:bg-pink-100"
              >
                {VI.auth.forgotPassword.backToLogin}
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
            {VI.auth.forgotPassword.back}
          </Link>

          <h2 className="mb-1 text-2xl font-extrabold text-indigo-950">{VI.auth.forgotPassword.title}</h2>
          <p className="mb-6 text-sm font-medium text-indigo-900/75">{VI.auth.forgotPassword.subtitle}</p>

          <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-4">
            <Form.Item
              label={VI.auth.forgotPassword.identifierLabel}
              name="identifier"
              rules={[
                { required: true, message: VI.auth.forgotPassword.validation.identifierRequired },
              ]}
            >
              <Input
                placeholder={VI.auth.forgotPassword.identifierPlaceholder}
                size="large"
                prefix={<Mail className="h-4 w-4 text-indigo-900/50" aria-hidden />}
                className="h-11 rounded-xl border-[2px] border-indigo-950/25 px-4"
              />
            </Form.Item>

            <ConfirmButton type="submit" label={VI.auth.forgotPassword.sendButton} loading={submitting} />
          </Form>
        </div>
      </Card>
    </AuthLayout>
  )
}
