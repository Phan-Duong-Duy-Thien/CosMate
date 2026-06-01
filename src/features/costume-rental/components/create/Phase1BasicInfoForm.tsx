/**
 * Phase1BasicInfoForm
 *
 * Ant Design form for basic costume info.
 * Calls onSubmit with validated values – never calls API directly.
 */

import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Alert, Avatar, Button, Card, Col, Form, Input, InputNumber, Modal, Radio, Row, Select, Space, Upload, message, QRCode, Spin } from 'antd'
import { CloseOutlined, InboxOutlined, PlusOutlined, RobotOutlined } from '@ant-design/icons'
import { Image as AntImage } from 'antd'
import { ImageIcon, Monitor, RefreshCw, Smartphone } from 'lucide-react'
import type { SelectProps, UploadFile, UploadProps } from 'antd'
import type { CreateCostumeBasicPayload, CostumeSizeOption } from '../../types'
import { generateCostumeDescriptionByAI } from '../../api/costumeRental.api'
import { createCharacterRequest } from '../../api/characterRequests.api'
import { applyFormValidationErrors } from '@/shared/utils/formValidation'
import { getCharacters } from '@/features/admin/api/adminCharacters.api'
import AILoadingMascot from '@/shared/components/AILoadingMascot'
import { AiTokenEmptyState } from '@/features/profile/components/AiTokenEmptyState'
import { useAiTokenGate } from '@/features/profile/hooks/useAiTokenGate'
import { VI } from '@/shared/i18n/vi'
import { notifyTokenChanged } from '@/shared/sync/dataSync'
import { mapGenerateDescriptionError } from '../../utils/costumeAiErrors'
import { useProviderMediaQrSession } from '../../hooks/useProviderMediaQrSession'

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
  videoFiles?: { fileList: UploadFile[] }
}

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

interface Props {
  onSubmit: (values: Omit<CreateCostumeBasicPayload, 'providerId'> & { imageFiles: File[] }) => Promise<void>
  loading: boolean
  error: string | null
  disabled: boolean
  providerId?: number
}

export default function Phase1BasicInfoForm({ onSubmit, loading, error, disabled, providerId }: Props) {
  const [form] = Form.useForm<FormValues>()
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [characters, setCharacters] = useState<CharacterOption[]>([])
  const [isCharactersLoading, setIsCharactersLoading] = useState(false)
  const [moderationError, setModerationError] = useState<string | null>(null)
  const [personaId, setPersonaId] = useState<number>(1)
  const [isCharacterRequestModalOpen, setIsCharacterRequestModalOpen] = useState(false)
  const [characterRequestForm] = Form.useForm<CharacterRequestFormValues>()
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  const [videoFileList, setVideoFileList] = useState<UploadFile[]>([])
  const [localImageFileList, setLocalImageFileList] = useState<UploadFile[]>([])
  const [qrPreviewOpen, setQrPreviewOpen] = useState(false)
  const {
    qrValue,
    sessionLoading,
    sessionError,
    refreshSession,
    canRefreshQr,
    refreshCooldownLabel,
    isListening,
    imageItems: qrImageItems,
    removeImageItem,
    maxImages,
  } = useProviderMediaQrSession(true, localImageFileList.length)

  const watchedName = Form.useWatch('name', form)

  const totalImageCount = qrImageItems.length + localImageFileList.length
  const remainingImageSlots = Math.max(0, maxImages - totalImageCount)

  const canGenerateAI = useMemo(() => {
    const hasName = Boolean(watchedName?.trim())
    return hasName && totalImageCount > 0
  }, [totalImageCount, watchedName])

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

  const qrImagesToFiles = async (): Promise<File[]> => {
    const files: File[] = []
    for (const qrImage of qrImageItems) {
      const blobRes = await fetch(qrImage.url)
      const blob = await blobRes.blob()
      const ext = blob.type.includes('png') ? 'png' : 'jpg'
      files.push(
        new File([blob], `provider-qr-image-${qrImage.id}.${ext}`, {
          type: blob.type || 'image/jpeg',
        }),
      )
    }
    return files
  }

  const localImagesToFiles = (): File[] =>
    localImageFileList
      .map((file) => file.originFileObj)
      .filter((file): file is File => file !== undefined)

  const getAllImageFiles = async (): Promise<File[]> => {
    const qrFiles = await qrImagesToFiles()
    return [...localImagesToFiles(), ...qrFiles]
  }

  const imageUploadProps: UploadProps = {
    multiple: true,
    accept: 'image/*',
    fileList: localImageFileList,
    showUploadList: false,
    beforeUpload: (file) => {
      if (remainingImageSlots <= 0) {
        message.warning(`Tối đa ${maxImages} ảnh (QR + máy tính).`)
        return Upload.LIST_IGNORE
      }
      if (!file.thumbUrl && file.type.startsWith('image/')) {
        file.thumbUrl = URL.createObjectURL(file)
      }
      return false
    },
    onChange: ({ fileList }) => {
      const maxLocal = Math.max(0, maxImages - qrImageItems.length)
      const next = fileList.slice(0, maxLocal)
      setLocalImageFileList((prev) => {
        const removed = prev.filter((item) => !next.some((n) => n.uid === item.uid))
        removed.forEach((item) => {
          if (item.thumbUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(item.thumbUrl)
          }
        })
        return next
      })
    },
  }

  const removeLocalImage = (uid: string) => {
    setLocalImageFileList((prev) => {
      const target = prev.find((file) => file.uid === uid)
      if (target?.thumbUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(target.thumbUrl)
      }
      return prev.filter((file) => file.uid !== uid)
    })
  }

  const handleGenerateDescription = async () => {
    const values = form.getFieldsValue()
    const name = String(values?.name || '').trim()

    if (!name) {
      message.warning('Vui lòng nhập tên trang phục trước khi tạo mô tả AI.')
      return
    }
    if (totalImageCount === 0) {
      message.warning('Vui lòng thêm ít nhất 1 hình ảnh (QR hoặc từ máy tính) trước khi tạo mô tả AI.')
      return
    }

    setIsAiGenerating(true)
    try {
      const files = await getAllImageFiles()
      const aiDescription = await generateCostumeDescriptionByAI(name, files, personaId)
      if (aiDescription?.trim()) {
        form.setFieldValue('description', aiDescription)
        message.success('AI đã tạo mô tả thành công.')
        notifyTokenChanged()
      } else {
        message.warning('AI chưa trả về mô tả phù hợp. Bạn có thể thử lại.')
      }
    } catch (err: unknown) {
      if (!applyFormValidationErrors(form, err)) {
        message.error(mapGenerateDescriptionError(err))
      }
    } finally {
      setIsAiGenerating(false)
    }
  }

  const videoUploadProps: UploadProps = {
    accept: '.mp4,.mov,video/mp4,video/quicktime',
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|mov)$/i.test(file.name)
      if (!isVideo) {
        message.error('Chỉ hỗ trợ video định dạng .mp4 hoặc .mov')
        return Upload.LIST_IGNORE
      }
      const maxSizeMb = 20
      if (file.size / 1024 / 1024 > maxSizeMb) {
        message.error(`Video không được vượt quá ${maxSizeMb}MB`)
        return Upload.LIST_IGNORE
      }
      const preview = URL.createObjectURL(file)
      setVideoPreviewUrl(preview)
      setVideoFileList([{ uid: file.uid, name: file.name, status: 'done', originFileObj: file }])
      form.setFieldValue('videoFiles', { fileList: [{ uid: file.uid, name: file.name, status: 'done', originFileObj: file }] })
      return false
    },
    onRemove: () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl)
      setVideoPreviewUrl(null)
      setVideoFileList([])
      form.setFieldValue('videoFiles', { fileList: [] })
    },
    fileList: videoFileList,
    maxCount: 1,
    listType: 'picture',
  }

  const handleCharacterRequestSubmit = async () => {
    try {
      const values = await characterRequestForm.validateFields()
      const pid = providerId ?? 0
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

  const handleFinish = async (values: FormValues) => {
    if (totalImageCount === 0) {
      message.error('Vui lòng thêm ít nhất 1 hình ảnh (QR hoặc từ máy tính).')
      return
    }

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
      const imageFiles = await getAllImageFiles()

      const submitPayload = {
        name: values.name,
        description: values.description,
        characterIds: values.characterIds ?? [],
        size: sizeString as CreateCostumeBasicPayload['size'],
        numberOfItems: values.numberOfItems,
        pricePerDay: values.pricePerDay,
        rentDiscount: values.rentDiscount,
        depositAmount: values.depositAmount,
        imageFiles,
        rentalOptions: null,
        videoFile: values.videoFiles?.fileList?.[0]?.originFileObj ?? null,
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
        style={{ maxWidth: 640, margin: '0 auto' }}
      >
        {error && (
          <Form.Item>
            <Alert type="error" message={error} showIcon />
          </Form.Item>
        )}

        <Form.Item label="Tên trang phục" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên trang phục' }, { max: 120, message: 'Tên trang phục không vượt quá 120 ký tự' }]}>
          <Input placeholder="Nhập tên trang phục" maxLength={120} />
        </Form.Item>

        <Form.Item
          label="Nhân vật Anime / Game"
          extra={isCharacterSelectionFull ? 'Tối đa 3 nhân vật' : undefined}
          style={{ marginBottom: 0 }}
        >
          <Form.Item name="characterIds" noStyle>
            <Select
              mode="multiple"
              showSearch
              allowClear
              placeholder="Chọn nhân vật"
              loading={isCharactersLoading}
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
                return String(option?.title ?? '').toLowerCase().includes(keyword)
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
          <div style={{ marginTop: 8, marginBottom: 24 }}>
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
          label="Hình ảnh trang phục"
          required
          extra={`Tối đa ${maxImages} ảnh — quét QR từ điện thoại hoặc chọn từ máy tính`}
        >
          <div className="rounded-xl border border-cosmate-pink/20 bg-cosmate-soft-pink/10 p-4">
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">
                Đã chọn {totalImageCount}/{maxImages} ảnh
              </p>
              {remainingImageSlots <= 0 && (
                <span className="text-xs font-medium text-amber-700">Đã đủ số lượng ảnh</span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-cosmate-pink" />
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Từ điện thoại</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {sessionError ? (
                    <p className="text-center text-xs font-medium text-rose-600">{sessionError}</p>
                  ) : sessionLoading || !qrValue ? (
                    <Spin size="small" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setQrPreviewOpen(true)}
                      className="cursor-zoom-in rounded-lg border border-transparent p-1 transition-colors hover:border-cosmate-pink/30 hover:bg-cosmate-soft-pink/20"
                      title="Nhấn để phóng to QR"
                      aria-label="Phóng to mã QR"
                    >
                      <QRCode value={qrValue} size={128} bordered={false} />
                    </button>
                  )}
                  {!sessionLoading && qrValue && (
                    <p className="text-center text-xs text-muted-foreground">Nhấn QR để phóng to</p>
                  )}
                  <Button
                    type="link"
                    size="small"
                    icon={<RefreshCw className="h-3.5 w-3.5" />}
                    onClick={refreshSession}
                    disabled={sessionLoading || !canRefreshQr}
                    className="!px-0"
                  >
                    {canRefreshQr ? 'Làm mới QR' : `Làm mới sau ${refreshCooldownLabel ?? ''}`}
                  </Button>
                  {isListening && qrImageItems.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground">Đang chờ ảnh từ mobile…</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-cosmate-pink" />
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Từ máy tính</p>
                </div>
                <Upload.Dragger
                  {...imageUploadProps}
                  disabled={remainingImageSlots <= 0}
                  className="!bg-muted/20 [&_.ant-upload-drag]:!border-dashed [&_.ant-upload-drag]:!border-border [&_.ant-upload-drag]:!bg-transparent [&_.ant-upload-drag]:!py-6"
                >
                  <p className="ant-upload-drag-icon !mb-1">
                    <InboxOutlined className="!text-cosmate-pink" />
                  </p>
                  <p className="text-xs font-medium text-foreground">Kéo thả hoặc nhấn để chọn ảnh</p>
                  <p className="text-xs text-muted-foreground">Còn thêm được {remainingImageSlots} ảnh</p>
                </Upload.Dragger>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-background p-3">
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Ảnh đã chọn</p>
              {totalImageCount === 0 ? (
                <div className="flex min-h-[84px] items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  <span>Chưa có ảnh — hãy quét QR hoặc chọn từ máy tính</span>
                </div>
              ) : (
                <AntImage.PreviewGroup>
                  <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {localImageFileList.map((file) => (
                        <li
                          key={file.uid}
                          className="group relative aspect-square overflow-hidden rounded-md border border-border"
                        >
                          <Button
                            danger
                            type="primary"
                            size="small"
                            shape="circle"
                            icon={<CloseOutlined />}
                            className="!absolute !right-1 !top-1 !z-10 !h-6 !w-6 !min-w-0 !opacity-90 md:!opacity-0 md:group-hover:!opacity-100"
                            onClick={(event) => {
                              event.preventDefault()
                              event.stopPropagation()
                              removeLocalImage(file.uid)
                            }}
                          />
                          {file.thumbUrl ? (
                            <AntImage
                              src={file.thumbUrl}
                              alt=""
                              className="!h-full !w-full !object-cover"
                              rootClassName="!h-full !w-full"
                            />
                          ) : null}
                        </li>
                      ))}
                    {qrImageItems.map((item) => (
                      <li key={item.id} className="group relative aspect-square overflow-hidden rounded-md border border-border">
                        <Button
                          danger
                          type="primary"
                          size="small"
                          shape="circle"
                          icon={<CloseOutlined />}
                          className="!absolute !right-1 !top-1 !z-10 !h-6 !w-6 !min-w-0 !opacity-90 md:!opacity-0 md:group-hover:!opacity-100"
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            removeImageItem(item.id)
                          }}
                        />
                        <AntImage src={item.url} alt="" className="!h-full !w-full !object-cover" rootClassName="!h-full !w-full" />
                      </li>
                    ))}
                  </ul>
                </AntImage.PreviewGroup>
              )}
            </div>
          </div>
        </Form.Item>

        <Form.Item label="Video giới thiệu" name="videoFiles" valuePropName="videoFiles">
          <Upload.Dragger {...videoUploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Kéo thả hoặc nhấn để tải video lên</p>
            <p className="ant-upload-hint">Hỗ trợ .mp4, .mov — tối đa 20MB</p>
          </Upload.Dragger>
          {videoPreviewUrl && (
            <div style={{ marginTop: 12, border: '4px solid #000', borderRadius: 16, overflow: 'hidden', boxShadow: '6px 6px 0 0 #000' }}>
              <video src={videoPreviewUrl} controls style={{ width: '100%', display: 'block', background: '#000' }} />
            </div>
          )}
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

          <Form.Item label="Chọn phong cách mô tả" style={{ marginBottom: 16 }}>
            <Radio.Group
              value={personaId}
              onChange={(event) => setPersonaId(event.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value={1}>Sale chuyên nghiệp</Radio.Button>
              <Radio.Button value={2}>Cute Gen Z</Radio.Button>
              <Radio.Button value={3}>Deep Cổ trang</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Row justify="end">
            <Col>
              <Button type="primary" icon={<RobotOutlined />} onClick={handleGenerateDescription} loading={isAiGenerating} disabled={disabled || loading || isAiGenerating || !canGenerateAI}>
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

        <Form.Item
          label="Giảm giá thuê (%)"
          name="rentDiscount"
          tooltip="Phần trăm giảm giá áp dụng cho các ngày thuê tiếp theo (từ ngày thứ 2 trở đi). Ví dụ: 20% nghĩa là từ ngày 2, khách chỉ trả 80% giá gốc/ngày."
          extra="0% = không giảm giá | 50% = từ ngày 2 chỉ trả nửa giá"
        >
          <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="Ví dụ: 20" addonAfter="%" />
        </Form.Item>

        <Form.Item label="Tiền đặt cọc (VNĐ)" name="depositAmount">
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Tiền đặt cọc" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tiếp theo →
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Quét mã QR"
        open={qrPreviewOpen && Boolean(qrValue)}
        onCancel={() => setQrPreviewOpen(false)}
        footer={null}
        centered
        width={360}
        destroyOnClose
      >
        {qrValue && (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <QRCode value={qrValue} size={280} bordered={false} />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Mở app CosMate trên điện thoại và quét mã để tải ảnh lên.
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Yêu cầu thêm nhân vật mới"
        open={isCharacterRequestModalOpen}
        onCancel={() => setIsCharacterRequestModalOpen(false)}
        onOk={handleCharacterRequestSubmit}
        okText="Gửi Yêu Cầu"
        cancelText="Hủy"
        centered
      >
        <Form form={characterRequestForm} layout="vertical">
          <Form.Item name="characterName" label="Tên nhân vật" rules={[{ required: true, message: 'Vui lòng nhập tên nhân vật' }]}>
            <Input placeholder="Ví dụ: Itachi Uchiha" />
          </Form.Item>
          <Form.Item name="animeName" label="Tên Anime/Game" rules={[{ required: true, message: 'Vui lòng nhập tên Anime/Game' }]}>
            <Input placeholder="Ví dụ: Naruto" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
