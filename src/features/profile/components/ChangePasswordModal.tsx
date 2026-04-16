import * as React from 'react'
import { Modal, Form, Input, Button } from 'antd'
import { useChangePassword } from '@/features/auth/hooks/useChangePassword'
import { VI } from '@/shared/i18n/vi'

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
      title={VI.auth.changePassword.title}
      open={open}
      onCancel={() => handleOpenChange(false)}
      footer={null}
      destroyOnClose
      width={420}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        requiredMark={false}
      >
        <Form.Item
          name="oldPassword"
          label={VI.auth.changePassword.oldPassword}
          rules={[{ required: true, message: VI.auth.changePassword.error.required }]}
        >
          <Input.Password
            placeholder={VI.auth.changePassword.placeholders.oldPassword}
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label={VI.auth.changePassword.newPassword}
          rules={[
            { required: true, message: VI.auth.changePassword.error.required },
            { min: 6, message: VI.auth.changePassword.error.minLength },
          ]}
        >
          <Input.Password
            placeholder={VI.auth.changePassword.placeholders.newPassword}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={VI.auth.changePassword.confirmPassword}
          dependencies={['newPassword']}
          rules={[
            { required: true, message: VI.auth.changePassword.error.required },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
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
          />
        </Form.Item>

        {localError && (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {localError}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button onClick={() => handleOpenChange(false)} disabled={loading}>
            {VI.common.actions.cancel}
          </Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {VI.auth.changePassword.submit}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
