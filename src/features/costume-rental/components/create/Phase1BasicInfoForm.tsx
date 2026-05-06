/**
 * Phase1BasicInfoForm
 *
 * Ant Design form for basic costume info.
 * Calls onSubmit with validated values – never calls API directly.
 */

import { useEffect, useMemo, useState } from 'react'
import { Alert, Avatar, Button, Card, Col, Form, Input, InputNumber, Row, Select, Upload, message } from 'antd'
import { InboxOutlined, RobotOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import type { CreateCostumeBasicPayload, CostumeSizeOption } from '../../types'
import { generateCostumeDescriptionByAI } from '../../api/costumeRental.api'
import { applyFormValidationErrors } from '@/shared/utils/formValidation'
import { getCharacters } from '@/features/admin/api/adminCharacters.api'
import AILoadingMascot from '@/shared/components/AILoadingMascot'

const { Dragger } = Upload
const { TextArea } = Input

const SIZE_OPTIONS: CostumeSizeOption[] = ['S', 'M', 'L', 'XL', 'FREESIZE']
const MODERATION_ERROR_MESSAGE = 'Ảnh của bạn vi phạm tiêu chuẩn cộng đồng, xin hãy dùng ảnh khác'

interface FormValues {
  name: string
  description: string
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
  imageFiles: { fileList: UploadFile[] }
}

interface CharacterOption {
  id: number
  name: string
  anime: string
  imageUrl?: string
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
  const [characters, setCharacters] = useState<CharacterOption[]>([])
  const [isCharactersLoading, setIsCharactersLoading] = useState(false)
  const [moderationError, setModerationError] = useState<string | null>(null)

  const watchedName = Form.useWatch('name', form)
  const watchedImages = Form.useWatch('imageFiles', form)

  const canGenerateAI = useMemo(() => {
    const hasName = Boolean(watchedName?.trim())
    const hasImages = (watchedImages?.fileList?.length ?? 0) > 0
    return hasName && hasImages
  }, [watchedImages, watchedName])

  const characterOptions = useMemo(
    () =>
      characters.map((character) => ({
        value: character.id,
        title: `${character.name} ${character.anime}`.trim(),
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
      })),
    [characters],
  )

  useEffect(() => {
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

    void fetchCharacters()
  }, [])

  const extractFilesFromForm = (values?: FormValues): File[] => {
    const raw = values?.imageFiles?.fileList ?? []
    return raw.map((f: UploadFile) => f.originFileObj).filter((f): f is File => f !== undefined)
  }

  const handleGenerateDescription = async () => {
    const values = form.getFieldsValue()
    const name = String(values?.name || '').trim()
    const promptText = String(form.getFieldValue('customPrompt') || '').trim()
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
      const aiDescription = await generateCostumeDescriptionByAI(name, files, promptText)
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
        size: sizeString as CreateCostumeBasicPayload['size'],
        numberOfItems: values.numberOfItems,
        pricePerDay: values.pricePerDay,
        rentDiscount: values.rentDiscount,
        depositAmount: values.depositAmount,
        imageFiles: rawFiles,
        rentalOptions: null,
      }
      await onSubmit(submitPayload)
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : ''
      if (errMessage.includes('vi phạm tiêu chuẩn cộng đồng') || errMessage.includes('Read timed out') || errMessage.includes('Lỗi kiểm duyệt ảnh')) {
        setModerationError(MODERATION_ERROR_MESSAGE)
        message.error(MODERATION_ERROR_MESSAGE)
        return
      }
      throw err
    }
  }

  return (
    <>
      {moderationError && (
        <AILoadingMascot type="moderation" onClose={() => setModerationError(null)} />
      )}

      <Form
        form={form}
        layout="vertical"
        initialValues={{ characterIds: [] }}
        onFinish={handleFinish}
        disabled={disabled || loading}
        style={{ maxWidth: 640 }}
      >
        {error && (
          <Form.Item>
            <Alert type="error" message={error} showIcon />
          </Form.Item>
        )}

        <Form.Item label="Tên trang phục" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên trang phục' }, { max: 120, message: 'Tên trang phục không vượt quá 120 ký tự' }]}>
          <Input placeholder="Nhập tên trang phục" maxLength={120} />
        </Form.Item>

        <Form.Item label="Nhân vật Anime / Game" name="characterIds">
          <Select
            mode="multiple"
            showSearch
            allowClear
            placeholder="Chọn nhân vật"
            loading={isCharactersLoading}
            optionFilterProp="title"
            filterOption={(input, option) => {
              const keyword = input.toLowerCase().trim()
              if (!keyword) return true
              return String(option?.title ?? '').toLowerCase().includes(keyword)
            }}
            options={characterOptions}
          />
        </Form.Item>

        <Card
          size="small"
          title="✨ AI Hỗ trợ viết mô tả"
          style={{
            marginBottom: 16,
            background: "color-mix(in oklch, var(--cosmate-info) 6%, var(--background))",
            borderColor: "color-mix(in oklch, var(--cosmate-info) 35%, var(--border))",
          }}
        >
          {isAiGenerating && (
            <div style={{ marginBottom: 16 }}>
              <AILoadingMascot type="content" variant="inline" />
            </div>
          )}

          <Form.Item label="Mô tả" name="description" style={{ marginBottom: 16 }}>
            <TextArea rows={4} autoSize={{ minRows: 4, maxRows: 10 }} placeholder="Mô tả trang phục" disabled={isAiGenerating} />
          </Form.Item>

          <Row gutter={12} align="middle">
            <Col flex="auto">
              <Form.Item label="Prompt tuỳ chỉnh cho AI" name="customPrompt" style={{ marginBottom: 0 }}>
                <Input.TextArea rows={3} autoSize={{ minRows: 2, maxRows: 4 }} placeholder="Ví dụ: viết theo phong cách ngắn gọn, sang trọng, nhấn mạnh chất liệu và vibe anime..." />
              </Form.Item>
            </Col>
            <Col>
              <Button type="primary" icon={<RobotOutlined />} onClick={handleGenerateDescription} loading={isAiGenerating} disabled={disabled || loading || isAiGenerating || !canGenerateAI} style={{ marginTop: 30 }}>
                AI tự viết mô tả
              </Button>
            </Col>
          </Row>
        </Card>

        <Form.Item label="Kích cỡ" name="size">
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
            <Form.Item label="Chiều cao tối thiểu (cm)" name="heightMin">
              <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 145" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Chiều cao tối đa (cm)" name="heightMax">
              <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 155" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="Cân nặng tối thiểu (kg)" name="weightMin">
              <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 40" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Cân nặng tối đa (kg)" name="weightMax">
              <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 55" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Số lượng vật phẩm (bao gồm tất cả vật phẩm và trang phục)" name="numberOfItems">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Số lượng vật phẩm" />
        </Form.Item>

        <Form.Item label="Giá thuê / ngày (VNĐ)" name="pricePerDay" rules={[{ required: true, message: 'Vui lòng nhập giá thuê' }]}>
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Giá thuê mỗi ngày" />
        </Form.Item>

        <Form.Item label="Tiền đặt cọc (VNĐ)" name="depositAmount">
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Tiền đặt cọc" />
        </Form.Item>

        <Form.Item label="Hình ảnh" name="imageFiles" valuePropName="imageFiles">
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
    </>
  )
}
