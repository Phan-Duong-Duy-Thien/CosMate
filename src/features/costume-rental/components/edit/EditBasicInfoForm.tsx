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

import { useEffect, useMemo, useState } from 'react'
import { Alert, Avatar, Button, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Upload, message } from 'antd'
import { InboxOutlined, PlusOutlined } from '@ant-design/icons'
import type { UploadFile, SelectProps } from 'antd'
import type { UpdateCostumeBasicInput, CostumeSizeOption, Costume } from '../../types'
import { applyFormValidationErrors } from '@/shared/utils/formValidation'
import { getCharacters } from '@/features/admin/api/adminCharacters.api'
import { createCharacterRequest } from '../../api/characterRequests.api'
import { VI } from '@/shared/i18n/vi'

const { Dragger } = Upload
const { TextArea } = Input

const SIZE_OPTIONS: CostumeSizeOption[] = ['S', 'M', 'L', 'XL', 'FREESIZE']
const MODERATION_ERROR_MESSAGE = 'Ảnh của bạn vi phạm tiêu chuẩn cộng đồng, xin hãy dùng ảnh khác'

interface CharacterOption {
  id: number
  name: string
  anime: string
  imageUrl?: string
}

interface CharacterRequestFormValues {
  characterName: string
  animeName: string
}

interface FormValues {
  name: string
  description?: string
  characterIds: number[]
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
  providerId?: number | null
}


export default function EditBasicInfoForm({
  initialValues,
  onSubmit,
  loading,
  providerIdMissing,
  providerId,
}: Props) {
  const [form] = Form.useForm<FormValues>()
  const [moderationError, setModerationError] = useState<string | null>(null)
  const watchedDescription = Form.useWatch('description', form) ?? ''

  const [characters, setCharacters] = useState<CharacterOption[]>([])
  const [isCharactersLoading, setIsCharactersLoading] = useState(false)
  const [isCharacterRequestModalOpen, setIsCharacterRequestModalOpen] = useState(false)
  const [characterRequestForm] = Form.useForm<CharacterRequestFormValues>()

  const fetchCharacters = async () => {
    setIsCharactersLoading(true)
    try {
      const data = await getCharacters()
      setCharacters(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch characters', err)
      message.error('Không thể tải danh sách nhân vật.')
    } finally {
      setIsCharactersLoading(false)
    }
  }

  useEffect(() => {
    void fetchCharacters()
  }, [])

  const selectedCharacterIds = Form.useWatch('characterIds', form) ?? []
  const isCharacterSelectionFull = selectedCharacterIds.length >= 3

  const characterOptions = useMemo(() => {
    const grouped = characters.reduce<Record<string, SelectProps['options']>>((acc, character) => {
      const anime = character.anime?.trim() || 'Khác'
      if (!acc[anime]) acc[anime] = []
      acc[anime].push({
        value: character.id,
        title: `${character.name} ${character.anime}`.trim(),
        disabled: isCharacterSelectionFull && !selectedCharacterIds.includes(character.id),
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar shape="square" size={36} src={character.imageUrl} alt={character.name} style={{ objectFit: 'cover', flexShrink: 0 }}>
              {character.name?.slice(0, 1)}
            </Avatar>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{character.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>{character.anime}</div>
            </div>
          </div>
        ),
      })
      return acc
    }, {})

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, options]) => ({ label, options }))
  }, [characters, isCharacterSelectionFull, selectedCharacterIds])

  const handleCharacterRequestSubmit = async () => {
    try {
      const values = await characterRequestForm.validateFields()
      const pid = providerId ?? initialValues.providerId ?? 0
      if (!pid) {
        message.error('Không xác định được Provider ID. Vui lòng thử lại.')
        return
      }
      await createCharacterRequest({
        characterName: values.characterName.trim(),
        animeName: values.animeName.trim(),
        providerId: pid,
      })
      message.success('Đã gửi yêu cầu thêm nhân vật mới.')
      setIsCharacterRequestModalOpen(false)
      characterRequestForm.resetFields()
    } catch (err) {
      if (err instanceof Error && err.name === 'ValidationError') return
      if (err instanceof Error) {
        message.error(err.message)
      }
    }
  }

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

    const initialCharacterIds = initialValues.characters?.map((c) => c.id) ?? []

    form.setFieldsValue({
      name: initialValues.name,
      description: initialValues.description,
      characterIds: initialCharacterIds,
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
      .filter((f): f is NonNullable<typeof f> => f !== undefined)
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
        characterIds: values.characterIds ?? [],
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
    <>
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
        label="Nhân vật Anime / Game"
        extra={isCharacterSelectionFull ? 'Tối đa 3 nhân vật' : undefined}
        style={{ marginBottom: 24 }}
      >
        <Form.Item name="characterIds" noStyle>
          <Select
            mode="multiple"
            showSearch
            allowClear
            placeholder="Chọn nhân vật"
            loading={isCharactersLoading}
            onFocus={fetchCharacters}
            optionFilterProp="title"
            onDeselect={() => undefined}
            maxTagCount="responsive"
            notFoundContent={
              <div style={{ padding: 12, textAlign: 'center', color: '#999' }}>
                Không tìm thấy nhân vật phù hợp.
              </div>
            }
            filterOption={(input, option) => {
              const keyword = input.toLowerCase().trim()
              if (!keyword) return true
              return String((option as any)?.title ?? '').toLowerCase().includes(keyword)
            }}
            options={characterOptions}
            onChange={(nextValue) => {
              if ((nextValue?.length ?? 0) > 3) {
                message.warning('Tối đa 3 nhân vật')
                form.setFieldValue('characterIds', (nextValue as number[]).slice(0, 3))
              }
            }}
          />
        </Form.Item>
        <div style={{ marginTop: 8 }}>
          <Button
            type="dashed"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setIsCharacterRequestModalOpen(true)}
            style={{ borderRadius: 6 }}
          >
            Nhân vật bạn tìm không có? Yêu cầu thêm mới
          </Button>
        </div>
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
        <InputNumber min={1} style={{ width: '100%' }} placeholder="Giá thuê mỗi ngày" />
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
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Tiền đặt cọc" />
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

      <Modal
        title="Yêu cầu thêm nhân vật mới"
        open={isCharacterRequestModalOpen}
        onOk={handleCharacterRequestSubmit}
        onCancel={() => {
          setIsCharacterRequestModalOpen(false)
          characterRequestForm.resetFields()
        }}
        okText="Gửi yêu cầu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={characterRequestForm} layout="vertical">
          <Form.Item
            name="characterName"
            label="Tên nhân vật"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhân vật' }]}
          >
            <Input placeholder="Ví dụ: Hatsune Miku" />
          </Form.Item>
          <Form.Item
            name="animeName"
            label="Tên tác phẩm (Anime / Game / Manga /...)"
            rules={[{ required: true, message: 'Vui lòng nhập tên tác phẩm' }]}
          >
            <Input placeholder="Ví dụ: Vocaloid" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
