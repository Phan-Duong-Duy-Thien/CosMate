import * as React from "react"
import { Loader2 } from "lucide-react"
import { Modal, Form, Input } from "antd"
import { Button } from "@/shared/components/Button"
import { useChangePassword } from "@/features/auth/hooks/useChangePassword"
import { VI } from "@/shared/i18n/vi"

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
  const [form] = Form.useForm()
  const { mutate, loading } = useChangePassword()
  const [localError, setLocalError] = React.useState<string | null>(null)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.resetFields()
      setLocalError(null)
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLocalError(null)

      if (values.newPassword !== values.confirmPassword) {
        setLocalError(VI.auth.changePassword.error.passwordMismatch)
        return
      }

      const ok = await mutate({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })

      if (ok) {
        form.resetFields()
        setLocalError(null)
        onOpenChange(false)
      }
    } catch {
      // Form validation errors are handled by Ant Design
    }
  }

  return (
    <Modal
      title={
        <span className="text-lg font-semibold tracking-tight text-foreground">
          {VI.auth.changePassword.title}
        </span>
      }
      open={open}
      onCancel={() => handleOpenChange(false)}
      footer={null}
      destroyOnClose
      width={440}
      centered
      classNames={{
        content: "overflow-hidden rounded-2xl border border-border shadow-lg",
        header: "border-b border-border pb-3",
        body: "pt-1",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        className="change-password-form mt-2 [&_.ant-form-item-explain-error]:text-xs [&_.ant-form-item-explain-error]:text-destructive [&_.ant-input-affix-wrapper]:rounded-xl [&_.ant-input-affix-wrapper]:!border [&_.ant-input-affix-wrapper]:!border-border [&_.ant-input-affix-wrapper]:!shadow-none [&_.ant-form-item-has-error_.ant-input-affix-wrapper]:!border-destructive"
        requiredMark={false}
      >
        <Form.Item
          name="oldPassword"
          label={
            <span className="text-sm font-medium text-foreground">
              {VI.auth.changePassword.oldPassword}
            </span>
          }
          rules={[{ required: true, message: VI.auth.changePassword.error.required }]}
        >
          <Input.Password
            placeholder={VI.auth.changePassword.placeholders.oldPassword}
            autoComplete="current-password"
            className="rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label={
            <span className="text-sm font-medium text-foreground">
              {VI.auth.changePassword.newPassword}
            </span>
          }
          rules={[
            { required: true, message: VI.auth.changePassword.error.required },
            { min: 6, message: VI.auth.changePassword.error.minLength },
          ]}
        >
          <Input.Password
            placeholder={VI.auth.changePassword.placeholders.newPassword}
            autoComplete="new-password"
            className="rounded-xl"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={
            <span className="text-sm font-medium text-foreground">
              {VI.auth.changePassword.confirmPassword}
            </span>
          }
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: VI.auth.changePassword.error.required },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(VI.auth.changePassword.error.passwordMismatch))
              },
            }),
          ]}
        >
          <Input.Password
            placeholder={VI.auth.changePassword.placeholders.confirmPassword}
            autoComplete="new-password"
            className="rounded-xl"
          />
        </Form.Item>

        {localError ? (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
          >
            {localError}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={loading}
            onClick={() => handleOpenChange(false)}
          >
            {VI.common.actions.cancel}
          </Button>
          <Button
            type="button"
            variant="soft"
            className="w-full rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[5px_5px_0_0_#1e1b4b] hover:brightness-105 sm:w-auto"
            disabled={loading}
            onClick={() => void handleSubmit()}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                <span>{VI.common.toast.loading}</span>
              </>
            ) : (
              VI.auth.changePassword.submit
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
