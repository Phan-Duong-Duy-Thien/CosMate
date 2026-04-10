import type { FormInstance } from "antd"
import { Form } from "antd"
import type { ReactNode } from "react"

import { AlertMessage } from "@/shared/components/AlertMessage"
import { ConfirmButton } from "./ConfirmButton"

type AuthFormProps<TValues extends object> = {
  form: FormInstance<TValues>
  onFinish: (values: TValues) => void | Promise<void>
  submitLabel: string
  submitting: boolean
  children: ReactNode
  formError?: string
}

export function AuthForm<TValues extends object>({
  form,
  onFinish,
  submitLabel,
  submitting,
  children,
  formError,
}: AuthFormProps<TValues>) {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
      {formError ? (
        <AlertMessage type="error" message={formError} />
      ) : null}

      <div className="space-y-4">{children}</div>

      <ConfirmButton type="submit" label={submitLabel} loading={submitting} />
    </Form>
  )
}
