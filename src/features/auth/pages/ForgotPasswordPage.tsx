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
import { useForgotPasswordRequest } from "../hooks/useForgotPasswordRequest"
import { VI } from "@/shared/i18n/vi"

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
        <Card className="w-full max-w-md rounded-2xl border-0 shadow-xl">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{VI.auth.forgotPassword.successTitle}</h2>
            <p className="text-sm text-muted-foreground">{VI.auth.forgotPassword.successMessage}</p>
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
            className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {VI.auth.forgotPassword.back}
          </Link>

          <h2 className="mb-1 text-2xl font-bold text-foreground">{VI.auth.forgotPassword.title}</h2>
          <p className="mb-6 text-sm text-muted-foreground">{VI.auth.forgotPassword.subtitle}</p>

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
                prefix={<Mail className="h-4 w-4 text-muted-foreground" />}
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
