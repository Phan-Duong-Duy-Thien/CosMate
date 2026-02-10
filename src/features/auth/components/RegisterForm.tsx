import { Form, Input } from "antd"
import { Lock, Mail, Phone, User } from "lucide-react"

import type { RegisterFormValues } from "../types"
import { AuthForm } from "./AuthForm"

type RegisterFormProps = {
  onSubmit: (values: RegisterFormValues) => void | Promise<void>
  submitting: boolean
  formError?: string
}

export function RegisterForm({ onSubmit, submitting, formError }: RegisterFormProps) {
  const [form] = Form.useForm<RegisterFormValues>()

  return (
    <AuthForm<RegisterFormValues>
      form={form}
      onFinish={onSubmit}
      submitLabel="Create account"
      submitting={submitting}
      formError={formError}
    >
      <Form.Item
        className="mb-0"
        label="Username"
        name="username"
        rules={[
          { required: true, message: "Username is required." },
          { min: 3, message: "Username must be at least 3 characters." },
        ]}
      >
        <Input
          placeholder="Choose a username"
          size="large"
          disabled={submitting}
          prefix={<User className="h-4 w-4 text-[#9CA3AF]" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>

      <Form.Item
        className="mb-0"
        label="Full name"
        name="fullName"
        rules={[{ required: true, message: "Full name is required." }]}
      >
        <Input
          placeholder="Enter your full name"
          size="large"
          disabled={submitting}
          prefix={<User className="h-4 w-4 text-[#9CA3AF]" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>

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
          prefix={<Mail className="h-4 w-4 text-[#9CA3AF]" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>

      <Form.Item
        className="mb-0"
        label="Phone"
        name="phone"
        rules={[
          { required: true, message: "Phone number is required." },
          { 
            pattern: /^0\d{9}$/, 
            message: "Phone must start with 0 and have 10 digits." 
          },
        ]}
      >
        <Input
          placeholder="0xxxxxxxxx"
          size="large"
          disabled={submitting}
          prefix={<Phone className="h-4 w-4 text-[#9CA3AF]" />}
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
          placeholder="Create a password"
          size="large"
          disabled={submitting}
          prefix={<Lock className="h-4 w-4 text-[#9CA3AF]" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>

      <Form.Item
        className="mb-0"
        label="Confirm password"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Confirm your password." },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error("Passwords do not match."))
            },
          }),
        ]}
      >
        <Input.Password
          placeholder="Re-enter your password"
          size="large"
          disabled={submitting}
          prefix={<Lock className="h-4 w-4 text-[#9CA3AF]" />}
          className="h-11 rounded-full px-4"
        />
      </Form.Item>
    </AuthForm>
  )
}
