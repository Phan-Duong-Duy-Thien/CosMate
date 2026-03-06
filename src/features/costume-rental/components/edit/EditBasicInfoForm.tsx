/**
 * EditBasicInfoForm
 *
 * UI-only form for editing costume basic info.
 * Mirrors Phase1BasicInfoForm but:
 *  - image upload is optional (no required validator)
 *  - prefills from `initialValues`
 *  - submit label is "Cập nhật thông tin cơ bản"
 *
 * Never calls API directly.
 */

import { useEffect } from 'react'
import { Button, Form, Input, InputNumber, Select, Upload, Alert } from 'antd'
import { InboxOutlined }from '@ant-design/icons'
import type { UploadFile } from 'antd'
import type { UpdateCostumeBasicInput, CostumeSizeOption, Costume } from '../../types'

const { Dragger } = Upload
const { TextArea } = Input

const SIZE_OPTIONS: CostumeSizeOption[] = ['S', 'M', 'L', 'XL', 'FREESIZE']

interface FormValues {
  name: string
  description?: string
  size: CostumeSizeOption
  numberOfItems: number
  pricePerDay: number
  depositAmount: number
  imageFiles?: { fileList: UploadFile[] }
}

interface Props {
  initialValues: Costume
  onSubmit: (values: UpdateCostumeBasicInput) => Promise<void>
  loading: boolean
  /** Set when providerId is missing from JWT */
  providerIdMissing?: boolean
}

export default function EditBasicInfoForm({
  initialValues,
  onSubmit,
  loading,
  providerIdMissing,
}: Props) {
  const [form] = Form.useForm<FormValues>()

  // Prefill whenever the detail changes (e.g. after a successful save)
  useEffect(() => {
    form.setFieldsValue({
      name: initialValues.name,
      description: initialValues.description,
      size: initialValues.size as CostumeSizeOption,
      numberOfItems: initialValues.numberOfItems,
      pricePerDay: initialValues.pricePerDay,
      depositAmount: initialValues.depositAmount,
    })
  }, [form, initialValues])

  const handleFinish = async (values: FormValues) => {
    const rawFiles = (values.imageFiles?.fileList ?? [])
      .map((f: UploadFile) => f.originFileObj)
      .filter((f): f is File => f !== undefined)

    await onSubmit({
      name: values.name,
      description: values.description,
      size: values.size,
      numberOfItems: values.numberOfItems,
      pricePerDay: values.pricePerDay,
      depositAmount: values.depositAmount,
      imageFiles: rawFiles.length > 0 ? rawFiles : undefined,
    })
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      disabled={loading || providerIdMissing}
      style={{ maxWidth: 640 }}
    >
      {providerIdMissing && (
        <Form.Item>
          <Alert
            type="error"
            message="Không tìm thấy providerId. Vui lòng đăng xuất và đăng nhập lại."
            showIcon
          />
        </Form.Item>
      )}

      <Form.Item
        label="Tên trang phục"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên trang phục' }]}
      >
        <Input placeholder="Nhập tên trang phục" />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <TextArea rows={3}placeholder="Mô tả trang phục" />
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
        <InputNumber min={1}style={{ width: '100%' }} placeholder="Giá thuê mỗi ngày" />
      </Form.Item>

      <Form.Item
        label="Tiền đặt cọc (VNĐ)"
        name="depositAmount"
        rules={[
          { required: true, message: 'Vui lòng nhập tiền đặt cọc' },
          { type: 'number', min: 0, message: 'Tiền đặt cọc không được âm' },
        ]}
      >
        <InputNumber min={0}style={{ width: '100%' }} placeholder="Tiền đặt cọc" />
      </Form.Item>

      <Form.Item
        label="Hình ảnh mới (tuỳ chọn)"
        name="imageFiles"
        valuePropName="imageFiles"
      >
        <Dragger
          multiple
          beforeUpload={() => false}
          accept="image/*"
          listType="picture"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Kéo thả hoặc nhấn để thay ảnh</p>
          <p className="ant-upload-hint">Để trống nếu không muốn thay đổi ảnh</p>
        </Dragger>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={providerIdMissing}
          block
        >
          Cập nhật thông tin cơ bản
        </Button>
      </Form.Item>
    </Form>
  )
}
