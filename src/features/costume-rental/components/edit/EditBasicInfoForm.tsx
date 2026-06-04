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

import { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Input, InputNumber, Row, Select, Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import type { UpdateCostumeBasicInput, CostumeSizeOption, Costume } from '../../types'
import { applyFormValidationErrors } from '@/shared/utils/formValidation'
import { VI } from '@/shared/i18n/vi'

const { Dragger } = Upload
const { TextArea } = Input

const SIZE_OPTIONS: CostumeSizeOption[] = ['S', 'M', 'L', 'XL', 'FREESIZE']
const MODERATION_ERROR_MESSAGE = 'Ảnh của bạn vi phạm tiêu chuẩn cộng đồng, xin hãy dùng ảnh khác'

interface FormValues {
  name: string
  description?: string
  size: CostumeSizeOption
  heightMin?: number
  heightMax?: number
  weightMin?: number
  weightMax?: number
  numberOfItems: number
  pricePerDay: number
  rentDiscount: number
  depositAmount: number
  imageFiles?: { fileList: UploadFile[] }
  cost?: number
  gender?: string
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
  const [moderationError, setModerationError] = useState<string | null>(null)
  const watchedDescription = Form.useWatch('description', form) ?? ''

  // Prefill whenever the detail changes (e.g. after a successful save)
  useEffect(() => {
    let sizeVal: CostumeSizeOption = 'FREESIZE'
    let heightMin: number | undefined
    let heightMax: number | undefined
    let weightMin: number | undefined
    let weightMax: number | undefined

    if (initialValues.size) {
      // Format: "M (150-160cm, 45-55kg)" or "FREESIZE"
      const match = initialValues.size.match(/^([a-zA-Z0-9]+)\s*\((\d+)-(\d+)cm,\s*(\d+)-(\d+)kg\)$/i)
      if (match) {
        sizeVal = match[1] as CostumeSizeOption
        heightMin = parseInt(match[2], 10)
        heightMax = parseInt(match[3], 10)
        weightMin = parseInt(match[4], 10)
        weightMax = parseInt(match[5], 10)
      } else {
        sizeVal = initialValues.size as CostumeSizeOption
      }
    }

    form.setFieldsValue({
      name: initialValues.name,
      description: initialValues.description,
      size: sizeVal,
      heightMin,
      heightMax,
      weightMin,
      weightMax,
      numberOfItems: initialValues.numberOfItems,
      pricePerDay: initialValues.pricePerDay,
      rentDiscount: initialValues.rentDiscount ?? 0,
      depositAmount: initialValues.depositAmount,
      cost: initialValues.cost,
      gender: initialValues.gender,
    })
  }, [form, initialValues])

  const handleFinish = async (values: FormValues) => {
    const rawFiles = (values.imageFiles?.fileList ?? [])
      .map((f: UploadFile) => f.originFileObj)
      .filter((f): f is File => f !== undefined)
    const rangeValues = values as FormValues & {
      heightMin?: number
      heightMax?: number
      weightMin?: number
      weightMax?: number
    }
    const hasFullRange =
      Number.isFinite(rangeValues.heightMin) &&
      Number.isFinite(rangeValues.heightMax) &&
      Number.isFinite(rangeValues.weightMin) &&
      Number.isFinite(rangeValues.weightMax)
    const sizeString = hasFullRange
      ? `${values.size} (${rangeValues.heightMin}-${rangeValues.heightMax}cm, ${rangeValues.weightMin}-${rangeValues.weightMax}kg)`
      : values.size

    setModerationError(null)

    try {
      const submitPayload = {
        name: values.name,
        description: values.description,
        size: sizeString as UpdateCostumeBasicInput['size'],
        numberOfItems: values.numberOfItems,
        pricePerDay: values.pricePerDay,
        rentDiscount: values.rentDiscount,
        depositAmount: values.depositAmount,
        cost: values.cost,
        gender: values.gender,
        imageFiles: rawFiles.length > 0 ? (rawFiles as unknown as File[]) : undefined,
        rentalOptions: null,
      }
      await onSubmit(submitPayload as UpdateCostumeBasicInput)
    } catch (error: unknown) {
      const handled = applyFormValidationErrors(form, error)
      const errMessage = error instanceof Error ? error.message : ''
      if (
        !handled &&
        (errMessage.includes('vi phạm tiêu chuẩn cộng đồng') ||
          errMessage.includes('Read timed out') ||
          errMessage.includes('Lỗi kiểm duyệt ảnh'))
      ) {
        setModerationError(MODERATION_ERROR_MESSAGE)
        message.error(MODERATION_ERROR_MESSAGE)
        return
      }
      throw error
    }
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

      {moderationError && (
        <Form.Item>
          <Alert
            type="error"
            showIcon={false}
            description={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>{MODERATION_ERROR_MESSAGE}</span>
              </div>
            }
          />
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
        label="Mô tả"
        name="description"
        extra={<div style={{ textAlign: 'right', fontSize: '12px', color: '#8c8c8c' }}>{watchedDescription.length}/2000</div>}
        rules={[{ max: 2000, message: 'Mô tả không được vượt quá 2000 ký tự' }]}
      >
        <TextArea rows={3} placeholder="Mô tả trang phục" maxLength={2000} />
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

      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Chiều cao tối thiểu (cm)"
            name="heightMin"
            tooltip="Chiều cao hợp lệ: lớn hơn 100cm và nhỏ hơn 200cm."
            rules={[
              {
                validator(_, value) {
                  if (value === undefined || value === null || value === '') return Promise.resolve();
                  if (value <= 100) {
                    return Promise.reject(new Error('Chiều cao tối thiểu phải lớn hơn 100cm'));
                  }
                  if (value >= 200) {
                    return Promise.reject(new Error('Chiều cao tối thiểu phải nhỏ hơn 200cm'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber min={101} max={199} style={{ width: '100%' }} placeholder="Ví dụ: 145" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Chiều cao tối đa (cm)"
            name="heightMax"
            tooltip="Chiều cao hợp lệ: lớn hơn 100cm và nhỏ hơn 200cm."
            dependencies={['heightMin']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value === undefined || value === null || value === '') return Promise.resolve();
                  if (value >= 200) {
                    return Promise.reject(new Error('Chiều cao tối đa phải nhỏ hơn 200cm'));
                  }
                  if (value <= 100) {
                    return Promise.reject(new Error('Chiều cao tối đa phải lớn hơn 100cm'));
                  }
                  const minHeight = getFieldValue('heightMin');
                  if (minHeight !== undefined && minHeight !== null && minHeight !== '' && value < minHeight) {
                    return Promise.reject(new Error('Chiều cao tối đa không được nhỏ hơn chiều cao tối thiểu'));
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <InputNumber min={101} max={199} style={{ width: '100%' }} placeholder="Ví dụ: 155" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Cân nặng tối thiểu (kg)"
            name="weightMin"
            tooltip="Cân nặng hợp lệ: từ 35kg đến 120kg."
            rules={[
              {
                validator(_, value) {
                  if (value === undefined || value === null || value === '') return Promise.resolve();
                  if (value < 35) {
                    return Promise.reject(new Error('Cân nặng tối thiểu phải từ 35kg trở lên'));
                  }
                  if (value > 120) {
                    return Promise.reject(new Error('Cân nặng tối thiểu phải nhỏ hơn hoặc bằng 120kg'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber min={35} max={120} style={{ width: '100%' }} placeholder="Ví dụ: 40" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Cân nặng tối đa (kg)"
            name="weightMax"
            tooltip="Cân nặng hợp lệ: từ 35kg đến 120kg."
            dependencies={['weightMin']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value === undefined || value === null || value === '') return Promise.resolve();
                  if (value > 120) {
                    return Promise.reject(new Error('Cân nặng tối đa phải nhỏ hơn hoặc bằng 120kg'));
                  }
                  if (value < 35) {
                    return Promise.reject(new Error('Cân nặng tối đa phải từ 35kg trở lên'));
                  }
                  const minWeight = getFieldValue('weightMin');
                  if (minWeight !== undefined && minWeight !== null && minWeight !== '' && value < minWeight) {
                    return Promise.reject(new Error('Cân nặng tối đa không được nhỏ hơn cân nặng tối thiểu'));
                  }
                  return Promise.resolve();
                }
              })
            ]}
          >
            <InputNumber min={35} max={120} style={{ width: '100%' }} placeholder="Ví dụ: 55" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Số lượng vật phẩm bao gồm tất cả vật phẩm và trang phục"
        name="numberOfItems"
        rules={[
          { required: true, message: 'Vui lòng nhập số lượng vật phẩm' },
          { type: 'number', min: 1, message: 'Số lượng vật phẩm phải lớn hơn 0' },
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
        label="Giảm giá thuê (%)"
        name="rentDiscount"
        tooltip="Phần trăm giảm giá áp dụng cho các ngày thuê tiếp theo (từ ngày thứ 2 trở đi). Ví dụ: 20% nghĩa là từ ngày 2, khách chỉ trả 80% giá gốc/ngày."
        extra="0% = không giảm giá | 50% = từ ngày 2 chỉ trả nửa giá"
        rules={[
          { required: true, message: 'Vui lòng nhập giảm giá thuê' },
          { type: 'number', min: 0, message: 'Giảm giá thuê không được âm' },
          {
            validator(_, value) {
              if (value !== undefined && value !== null && value >= 75) {
                return Promise.reject(new Error('Giảm giá thuê phải nhỏ hơn 75%'))
              }
              return Promise.resolve()
            }
          }
        ]}
      >
        <InputNumber min={0} max={74} style={{ width: '100%' }} placeholder="Ví dụ: 20" addonAfter="%" />
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
        label="Giá trị bộ đồ (VNĐ)"
        name="cost"
        rules={[
          { required: true, message: 'Vui lòng nhập giá trị bộ đồ' },
          { type: 'number', min: 0, message: 'Giá trị bộ đồ không được âm' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              const deposit = getFieldValue('depositAmount')
              if (value !== undefined && deposit !== undefined && value < deposit) {
                return Promise.reject(new Error('Giá trị bộ đồ phải lớn hơn hoặc bằng tiền đặt cọc'))
              }
              return Promise.resolve()
            },
          })
        ]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Giá trị thực tế của bộ đồ" />
      </Form.Item>

      <Form.Item
        label="Giới tính trang phục"
        name="gender"
        rules={[{ required: true, message: 'Vui lòng chọn giới tính trang phục' }]}
      >
        <Select placeholder="Chọn giới tính">
          <Select.Option value="MALE">Nam (MALE)</Select.Option>
          <Select.Option value="FEMALE">Nữ (FEMALE)</Select.Option>
          <Select.Option value="UNISEX">Cả hai (UNISEX)</Select.Option>
          <Select.Option value="GENDERLESS">Không phân biệt giới tính (GENDERLESS)</Select.Option>
        </Select>
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
