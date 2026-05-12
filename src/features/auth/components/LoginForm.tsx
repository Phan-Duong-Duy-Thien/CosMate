import { Checkbox, Form, Input } from "antd"
import { Lock, Mail } from "lucide-react"

import type { LoginFormValues } from "../types"
import { AuthForm } from "./AuthForm"
import { VI } from "@/shared/i18n/vi"

type LoginFormProps = {
  onSubmit: (values: LoginFormValues, form: ReturnType<typeof Form.useForm<LoginFormValues>>[0]) => void | Promise<void>
  submitting: boolean
  formError?: string
}

export function LoginForm({ onSubmit, submitting, formError }: LoginFormProps) {
  const [form] = Form.useForm<LoginFormValues>()

  return (
    <AuthForm<LoginFormValues>
      form={form}
      onFinish={onSubmit}
      submitLabel={VI.common.actions.login}
      submitting={submitting}
      formError={formError}
    >
      <Form.Item
        className="mb-0"
        label={VI.auth.login.emailOrUsername}
        name="usernameOrEmail"
        rules={[
          { required: true, message: VI.auth.login.validation.emailRequired },
        ]}
      >
        <Input
          placeholder={VI.auth.login.emailOrUsernamePlaceholder}
          size="large"
          disabled={submitting}
          prefix={<Mail className="h-4 w-4 text-muted-foreground" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>

      <Form.Item
        className="mb-0"
        label={VI.auth.login.password}
        name="password"
        rules={[
          { required: true, message: VI.auth.login.validation.passwordRequired },
          { min: 6, message: VI.auth.login.validation.passwordMinLength },
        ]}
      >
        <Input.Password
          placeholder={VI.auth.login.passwordPlaceholder}
          size="large"
          disabled={submitting}
          prefix={<Lock className="h-4 w-4 text-muted-foreground" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>

      <div className="flex items-center justify-end">
        <Form.Item
          className="mb-0"
          name="rememberMe"
          valuePropName="checked"
          initialValue={false}
        >
          <Checkbox disabled={submitting}>{VI.auth.login.rememberMe}</Checkbox>
        </Form.Item>
      </div>
    </AuthForm>
  )
}
