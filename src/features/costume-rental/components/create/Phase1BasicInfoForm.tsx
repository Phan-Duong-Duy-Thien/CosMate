/**
 * Phase1BasicInfoForm
 *
 * Ant Design form for basic costume info.
 * Calls onSubmit with validated values – never calls API directly.
 */

import { Button, Form, Input, InputNumber, Select, Upload, Alert, Tooltip } from 'antd'
import { InboxOutlined, RobotOutlined }from '@ant-design/icons'
import type { UploadFile } from 'antd'
import type { CreateCostumeBasicPayload, CostumeSizeOption } from '../../types'

const { Dragger } = Upload
const { TextArea } = Input

const SIZE_OPTIONS: CostumeSizeOption[] = ['S', 'M', 'L', 'XL', 'FREESIZE']

interface FormValues {
  name: string
  description: string
  size: CostumeSizeOption
  numberOfItems: number
  pricePerDay: number
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
      imageFiles: rawFiles,
    })
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      disabled={disabled}
      style={{ maxWidth: 640 }}
    >
      {error && (
        <Form.Item>
          <Alert type="error" message={error}showIcon />
        </Form.Item>
      )}

      <Form.Item
        label="Tên trang phục"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên trang phục' }]}
      >
        <Input placeholder="Nhập tên trang phục" />
      </Form.Item>

      <Form.Item
        label={(
          <div className="flex items-center gap-2">
            <span>Mô tả</span>
            <Tooltip title="Chức năng AI tự động tạo mô tả từ tên + ảnh trang phục bạn đang nhập.">
              <Button
                type="link"
                size="small"
                className="h-auto p-0 text-xs"
                icon={<RobotOutlined />}
                onClick={() => {}}
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
        <InputNumber min={1}style={{ width: '100%' }} placeholder="Số lượng" />
      </Form.Item>

      <Form.Item
        label="Giá thuê / ngày (VNĐ)"
        name="pricePerDay"
        rules={[
          { required: true, message: 'Vui lòng nhập giá thuê' },
          { type: 'number', min: 1, message: 'Giá thuê phải lớn hơn 0' },
        ]}
      >
        <InputNumber min={1} style={{ width: '100%' }}placeholder="Giá thuê mỗi ngày" />
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
        <Dragger
          multiple
          beforeUpload={() => false}
          accept="image/*"
          listType="picture"
        >
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
  )
}
