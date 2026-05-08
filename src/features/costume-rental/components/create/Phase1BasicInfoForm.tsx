/**
 * Phase1BasicInfoForm
 *
 * Ant Design form for basic costume info.
 * Calls onSubmit with validated values – never calls API directly.
 */

import { useEffect, useMemo, useState } from 'react'
import { Alert, Avatar, Button, Card, Col, Form, Input, InputNumber, Row, Select, Tooltip, Upload, message } from 'antd'
import { InboxOutlined, HighlightOutlined, RobotOutlined, StarFilled, InfoCircleOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import type { CreateCostumeBasicPayload, CostumeSizeOption } from '../../types'
import { generateCostumeDescriptionByAI } from '../../api/costumeRental.api'
import { applyFormValidationErrors } from '@/shared/utils/formValidation'
import { getCharacters } from '@/features/admin/api/adminCharacters.api'
import AILoadingMascot from '@/shared/components/AILoadingMascot'
import { useUserProfile } from '@/app/providers/UserProfileProvider'

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
  const { deductNumberOfToken } = useUserProfile()

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
    const personaId = Number(form.getFieldValue('personaId')) || 1
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
      const aiDescription = await generateCostumeDescriptionByAI(name, files, personaId)
      if (aiDescription?.trim()) {
        form.setFieldValue('description', aiDescription)
        deductNumberOfToken(1)
        message.success('AI đã tạo mô tả thành công. (-1 AI Token)')
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

        <div style={{ marginBottom: 24, background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', borderRadius: 16, border: '1px solid #E2E8F0', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)', borderRadius: 10, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(139, 92, 246, 0.2)' }}>
                <StarFilled style={{ color: 'white', fontSize: 18 }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#0F172A' }}>AI viết mô tả thông minh</span>
            </div>
            <Tooltip title="Nhập ảnh và tên trang phục để dùng chức năng AI tự động tạo mô tả trang phục">
              <InfoCircleOutlined style={{ color: '#94A3B8', fontSize: 20, cursor: 'help' }} />
            </Tooltip>
          </div>

          <Row gutter={12} style={{ marginBottom: 16 }}>
            <Col flex="auto">
              <Form.Item name="personaId" style={{ marginBottom: 0 }} initialValue={1}>
                <Select size="large" style={{ width: '100%', borderRadius: 8 }}>
                  <Select.Option value={1}>Phong cách Sale (Hấp dẫn, bán hàng)</Select.Option>
                  <Select.Option value={2}>Phong cách Cute (Đáng yêu, nhí nhảnh)</Select.Option>
                  <Select.Option value={3}>Phong cách Deep (Cổ trang, sâu lắng)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                icon={<HighlightOutlined />}
                onClick={handleGenerateDescription}
                loading={isAiGenerating}
                disabled={disabled || loading || isAiGenerating || !canGenerateAI}
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                  border: 'none',
                  fontWeight: 600,
                  borderRadius: 8,
                  padding: '0 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
              >
                Tạo mô tả tự động
              </Button>
            </Col>
          </Row>

          {isAiGenerating && (
            <div style={{ marginBottom: 16, background: 'white', padding: 12, borderRadius: 8, border: '1px dashed #CBD5E1' }}>
              <AILoadingMascot type="content" variant="inline" />
            </div>
          )}

          <Form.Item name="description" style={{ marginBottom: 0 }}>
            <TextArea
              rows={5}
              autoSize={{ minRows: 5, maxRows: 12 }}
              placeholder="Mô tả chi tiết trang phục của bạn ở đây... (Hoặc để AI giúp bạn viết nó!)"
              disabled={isAiGenerating}
              style={{ borderRadius: 12, padding: '16px', fontSize: 15, borderColor: '#E2E8F0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
            />
          </Form.Item>
        </div>

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
