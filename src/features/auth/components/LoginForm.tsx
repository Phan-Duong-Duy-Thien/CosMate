import { Form, Input } from "antd"

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
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Email is required." },
          { type: "email", message: "Enter a valid email address." },
        ]}
      >
        <Input
          placeholder="Enter your email"
          size="large"
          disabled={submitting}
          className="h-11"
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
          className="h-11"
        />
      </Form.Item>
    </AuthForm>
  )
}
