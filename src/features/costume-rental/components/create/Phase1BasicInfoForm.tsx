/**
 * Phase1BasicInfoForm
 *
 * Ant Design form for basic costume info.
 * Calls onSubmit with validated values – never calls API directly.
 */

import { useMemo, useState } from 'react'
import { Button, Form, Input, InputNumber, Select, Upload, Alert, Tooltip, message, Spin } from 'antd'
import { InboxOutlined, RobotOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import type { CreateCostumeBasicPayload, CostumeSizeOption } from '../../types'
import { generateCostumeDescriptionByAI } from '../../api/costumeRental.api'
import { VI } from '@/shared/i18n/vi'
import { applyFormValidationErrors } from '@/shared/utils/formValidation'

const { Dragger } = Upload
const { TextArea } = Input

const SIZE_OPTIONS: CostumeSizeOption[] = ['S', 'M', 'L', 'XL', 'FREESIZE']

interface FormValues {
  name: string
  description: string
  size: CostumeSizeOption
  numberOfItems: number
  pricePerDay: number
  rentDiscount: number
  depositAmount: number
  imageFiles: { fileList: UploadFile[] }
}

interface Props {
  onSubmit: (values: Omit<CreateCostumeBasicPayload, 'providerId'> & { imageFiles: File[] }) => Promise<void>
  loading: boolean
  error: string | null
  disabled: boolean
}

export default function Phase1BasicInfoForm({ onSubmit, loading, error, disabled }: Props) {
  const [form] = Form.useForm<FormValues>()
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')

  const watchedName = Form.useWatch('name', form)
  const watchedImages = Form.useWatch('imageFiles', form)

  const canGenerateAI = useMemo(() => {
    const hasName = Boolean(watchedName?.trim())
    const hasImages = (watchedImages?.fileList?.length ?? 0) > 0
    return hasName && hasImages
  }, [watchedImages, watchedName])

  const extractFilesFromForm = (values?: FormValues): File[] => {
    const raw = values?.imageFiles?.fileList ?? []
    return raw
      .map((f: UploadFile) => f.originFileObj)
      .filter((f): f is File => f !== undefined)
  }

  const handleGenerateDescription = async () => {
    const values = form.getFieldsValue()
    const name = values?.name?.trim()
    const files = extractFilesFromForm(values)

    if (!name) {
      message.warning('Vui lòng nhập tên trang phục trước khi tạo mô tả AI.')
      return
    }
    if (files.length === 0) {
      message.warning('Vui lòng tải lên ít nhất 1 hình ảnh trước khi tạo mô tả AI.')
      return
    }

    setIsAiGenerating(true)
    try {
      const aiDescription = await generateCostumeDescriptionByAI(name, files, customPrompt)
      if (aiDescription?.trim()) {
        form.setFieldValue('description', aiDescription)
        message.success('AI đã tạo mô tả thành công.')
      } else {
        message.warning('AI chưa trả về mô tả phù hợp. Bạn có thể thử lại.')
      }
    } catch (err: unknown) {
      if (!applyFormValidationErrors(form, err)) {
        const errMsg = err instanceof Error ? err.message : 'Không thể tạo mô tả bằng AI.'
        message.error(errMsg)
      }
    } finally {
      setIsAiGenerating(false)
    }
  }

  const handleFinish = async (values: FormValues) => {
    const rawFiles = extractFilesFromForm(values)
    await onSubmit({
      name: values.name,
      description: values.description,
      size: values.size,
      numberOfItems: values.numberOfItems,
      pricePerDay: values.pricePerDay,
      rentDiscount: values.rentDiscount,
      depositAmount: values.depositAmount,
      imageFiles: rawFiles,
    })
  }

  return (
    <div style={{ position: 'relative' }}>
      {(isAiGenerating || loading) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.72)',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
          }}
        >
          <Spin size="large" tip={isAiGenerating ? 'AI đang tạo mô tả...' : 'Đang tạo trang phục, vui lòng chờ...'} />
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        disabled={disabled || isAiGenerating || loading}
        style={{ maxWidth: 640 }}
      >
        {error && (
          <Form.Item>
            <Alert type="error" message={error} showIcon />
          </Form.Item>
        )}

        <Form.Item
          label="Tên trang phục"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên trang phục' }, { max: 120, message: 'Tên trang phục không vượt quá 120 ký tự' }]}
        >
          <Input placeholder="Nhập tên trang phục" maxLength={120} />
        </Form.Item>

        <Form.Item
          label={(
            <div className="flex items-center gap-2">
              <span>Mô tả</span>
              <Tooltip title="AI tạo mô tả từ tên + ảnh + prompt tuỳ chọn. Cần nhập tên và tải ít nhất 1 ảnh trước khi bấm.">
                <Button
                  type="link"
                  size="small"
                  className="h-auto p-0 text-xs"
                  icon={<RobotOutlined />}
                  onClick={handleGenerateDescription}
                  loading={isAiGenerating}
                  disabled={disabled || loading || isAiGenerating || !canGenerateAI}
                >
                  Tự động tạo mô tả
                </Button>
              </Tooltip>
            </div>
          )}
          name="description"
        >
          <TextArea rows={4} autoSize={{ minRows: 4, maxRows: 10 }} placeholder="Mô tả trang phục" />
        </Form.Item>

        <Form.Item label="Prompt tuỳ chỉnh cho AI" name="customPrompt">
          <TextArea
            rows={3}
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="Ví dụ: viết theo phong cách ngắn gọn, sang trọng, nhấn mạnh chất liệu và vibe anime..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Kích cỡ"
          name="size"
          rules={[{ required: true, message: 'Vui lòng chọn kích cỡ' }]}
        >
          <Select placeholder="Chọn kích cỡ">
            {SIZE_OPTIONS.map((s) => (
              <Select.Option key={s} value={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="numberOfItems"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng' },
            { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0' },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Số lượng" />
        </Form.Item>

        <Form.Item
          label="Giá thuê / ngày (VNĐ)"
          name="pricePerDay"
          rules={[
            { required: true, message: 'Vui lòng nhập giá thuê' },
            { type: 'number', min: 1, message: 'Giá thuê phải lớn hơn 0' },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Giá thuê mỗi ngày" />
        </Form.Item>

        <Form.Item
          label="Tiền đặt cọc (VNĐ)"
          name="depositAmount"
          rules={[
            { required: true, message: 'Vui lòng nhập tiền đặt cọc' },
            { type: 'number', min: 0, message: 'Tiền đặt cọc không được âm' },
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Tiền đặt cọc" />
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          name="imageFiles"
          valuePropName="imageFiles"
          rules={[
            {
              validator: (_, value) => {
                const list = value?.fileList ?? []
                if (list.length === 0) return Promise.reject('Vui lòng tải lên ít nhất 1 hình ảnh')
                return Promise.resolve()
              },
            },
          ]}
        >
          <Dragger multiple beforeUpload={() => false} accept="image/*" listType="picture">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Kéo thả hoặc nhấn để tải ảnh lên</p>
            <p className="ant-upload-hint">Hỗ trợ tải nhiều ảnh cùng lúc</p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tiếp theo →
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
