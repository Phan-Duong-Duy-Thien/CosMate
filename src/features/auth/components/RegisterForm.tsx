import { Form, Input } from "antd"
import { Lock, Mail, Phone, User } from "lucide-react"

import type { RegisterFormValues } from "../types"
import { AuthForm } from "./AuthForm"
import { VI } from "@/shared/i18n/vi"

type RegisterFormProps = {
  onSubmit: (values: RegisterFormValues, form: ReturnType<typeof Form.useForm<RegisterFormValues>>[0]) => void | Promise<void>
  submitting: boolean
  formError?: string
}

export function RegisterForm({ onSubmit, submitting, formError }: RegisterFormProps) {
  const [form] = Form.useForm<RegisterFormValues>()

  return (
    <AuthForm<RegisterFormValues>
      form={form}
      onFinish={onSubmit}
      submitLabel={VI.auth.register.createAccount}
      submitting={submitting}
      formError={formError}
    >
      <Form.Item
        className="mb-0"
        label={VI.auth.register.username}
        name="username"
        rules={[
          { required: true, message: VI.auth.register.validation.usernameRequired },
          { min: 3, message: VI.auth.register.validation.usernameMinLength },
        ]}
      >
        <Input
          placeholder={VI.auth.register.usernamePlaceholder}
          size="large"
          disabled={submitting}
          prefix={<User className="h-4 w-4 text-muted-foreground" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>

      <Form.Item
        className="mb-0"
        label={VI.auth.register.fullName}
        name="fullName"
        rules={[{ required: true, message: VI.auth.register.validation.fullNameRequired }]}
      >
        <Input
          placeholder={VI.auth.register.fullNamePlaceholder}
          size="large"
          disabled={submitting}
          prefix={<User className="h-4 w-4 text-muted-foreground" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>

      <Form.Item
        className="mb-0"
        label={VI.auth.register.email}
        name="email"
        rules={[
          { required: true, message: VI.auth.register.validation.emailRequired },
          { type: "email", message: VI.auth.register.validation.emailInvalid },
        ]}
      >
        <Input
          placeholder={VI.auth.register.emailPlaceholder}
          size="large"
          disabled={submitting}
          prefix={<Mail className="h-4 w-4 text-muted-foreground" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>

      <Form.Item
        className="mb-0"
        label={VI.auth.register.phone}
        name="phone"
        rules={[
          { required: true, message: VI.auth.register.validation.phoneRequired },
          {
            pattern: /^0\d{9}$/,
            message: VI.auth.register.validation.phoneInvalid
          },
        ]}
      >
        <Input
          placeholder={VI.auth.register.phonePlaceholder}
          size="large"
          disabled={submitting}
          prefix={<Phone className="h-4 w-4 text-muted-foreground" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>

      <Form.Item
        className="mb-0"
        label={VI.auth.register.password}
        name="password"
        rules={[
          { required: true, message: VI.auth.register.validation.passwordRequired },
          { min: 6, message: VI.auth.register.validation.passwordMinLength },
        ]}
      >
        <Input.Password
          placeholder={VI.auth.register.passwordPlaceholder}
          size="large"
          disabled={submitting}
          prefix={<Lock className="h-4 w-4 text-muted-foreground" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>

      <Form.Item
        className="mb-0"
        label={VI.auth.register.confirmPassword}
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: VI.auth.register.validation.confirmPasswordRequired },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error(VI.auth.register.validation.passwordMismatch))
            },
          }),
        ]}
      >
        <Input.Password
          placeholder={VI.auth.register.confirmPasswordPlaceholder}
          size="large"
          disabled={submitting}
          prefix={<Lock className="h-4 w-4 text-muted-foreground" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>
    </AuthForm>
  )
}
