import { Form, Input } from "antd"
import { Lock, Mail } from "lucide-react"

import type { LoginFormValues } from "../types"
import { AuthForm } from "./AuthForm"

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void | Promise<void>
  submitting: boolean
  formError?: string
}

export function LoginForm({ onSubmit, submitting, formError }: LoginFormProps) {
  const [form] = Form.useForm<LoginFormValues>()

  return (
    <AuthForm<LoginFormValues>
      form={form}
      onFinish={onSubmit}
      submitLabel="Login"
      submitting={submitting}
      formError={formError}
    >
      <Form.Item
        className="mb-0"
        label="Email or Username"
        name="usernameOrEmail"
        rules={[
          { required: true, message: "Email or username is required." },
        ]}
      >
        <Input
          placeholder="Enter your email or username"
          size="large"
          disabled={submitting}
          prefix={<Mail className="h-4 w-4 text-[#9CA3AF]" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>

      <Form.Item
        className="mb-0"
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Password is required." },
          { min: 6, message: "Password must be at least 6 characters." },
        ]}
      >
        <Input.Password
          placeholder="Enter your password"
          size="large"
          disabled={submitting}
          prefix={<Lock className="h-4 w-4 text-[#9CA3AF]" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>
    </AuthForm>
  )
}
