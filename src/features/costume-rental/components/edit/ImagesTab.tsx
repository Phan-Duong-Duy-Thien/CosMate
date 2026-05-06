/**
 * ImagesTab
 *
 * Tab C of the Edit Costume modal.
 * Displays MAIN and DETAIL images with replace/delete actions.
 * UI-only – all actions come from props (useCostumeImageActions hook).
 */

import { Button, Image, Space, Typography, Divider, Tooltip, Upload, Spin } from 'antd'
import { DeleteOutlined, SwapOutlined, PlusOutlined } from '@ant-design/icons'
import type { CostumeImage } from '../../api/costumeImages.api'
import { VI } from '@/shared/i18n/vi'

const { Text } = Typography

interface ImageCardProps {
  image: CostumeImage
  isMain: boolean
  canDelete: boolean
  deleting: boolean
  replacing: boolean
  onDelete?: () => void
  onReplace: (file: File) => void
}

function ImageCard({
  image,
  isMain,
  canDelete,
  deleting,
  replacing,
  onDelete,
  onReplace,
}: ImageCardProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        margin: 4,
      }}
    >
      <div style={{ position: 'relative' }}>
        {(deleting || replacing) && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'color-mix(in oklch, var(--foreground) 42%, transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              borderRadius: 4,
            }}
          >
            <Spin size="small" />
          </div>
        )}
        <Image
          src={image.url}
          width={100}
          height={100}
          style={{
            objectFit: 'cover',
            borderRadius: 4,
            border: isMain
              ? "2px solid var(--cosmate-info)"
              : "1px solid var(--border)",
          }}
          preview={{ mask: false }}
        />
      </div>
      <Space size={4}>
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            onReplace(file)
            return false
          }}
        >
          <Tooltip title={VI.costumeRental.images.replace}>
            <Button size="small" icon={<SwapOutlined />} loading={replacing} />
          </Tooltip>
        </Upload>
        {isMain ? (
          <Tooltip
            title={
              canDelete
                ? VI.costumeRental.images.delete
                : VI.costumeRental.images.deleteMainNotAllowed
            }
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={!canDelete}
              loading={deleting}
              onClick={onDelete}
            />
          </Tooltip>
        ) : (
          <Tooltip title={VI.costumeRental.images.delete}>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={deleting}
              onClick={onDelete}
            />
          </Tooltip>
        )}
      </Space>
    </div>
  )
}

export interface ImagesTabProps {
  mainImages: CostumeImage[]
  detailImages: CostumeImage[]
  loading: boolean
  canDeleteMain: boolean
  deleting: number | null
  replacing: number | null
  uploading: boolean
  onDeleteDetail: (imageId: number) => void
  onReplaceMain: (imageId: number, file: File) => void
  onReplaceDetail: (imageId: number, file: File) => void
  onAddDetail: (file: File) => void
}

export default function ImagesTab({
  mainImages,
  detailImages,
  loading,
  canDeleteMain,
  deleting,
  replacing,
  uploading,
  onDeleteDetail,
  onReplaceMain,
  onReplaceDetail,
  onAddDetail,
}: ImagesTabProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 32 }}>
        <Spin />
      </div>
    )
  }

  return (
    <div>
      <Text strong>{VI.costumeRental.images.main}</Text>
      {!canDeleteMain && mainImages.length > 0 && (
        <div style={{ marginTop: 4, marginBottom: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {VI.costumeRental.images.deleteMainNotAllowed}
          </Text>
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 8 }}>
        {mainImages.map((img) => (
          <ImageCard
            key={img.id}
            image={img}
            isMain
            canDelete={canDeleteMain}
            deleting={deleting === img.id}
            replacing={replacing === img.id}
            onReplace={(file) => onReplaceMain(img.id, file)}
          />
        ))}
        {mainImages.length === 0 && (
          <Text type="secondary">{VI.costumeRental.images.noImages}</Text>
        )}
      </div>

      <Divider />

      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text strong>{VI.costumeRental.images.detail}</Text>
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            onAddDetail(file)
            return false
          }}
        >
          <Button size="small" icon={<PlusOutlined />} loading={uploading}>
            {VI.costumeRental.images.addDetail}
          </Button>
        </Upload>
      </Space>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {detailImages.map((img) => (
          <ImageCard
            key={img.id}
            image={img}
            isMain={false}
            canDelete
            deleting={deleting === img.id}
            replacing={replacing === img.id}
            onDelete={() => onDeleteDetail(img.id)}
            onReplace={(file) => onReplaceDetail(img.id, file)}
          />
        ))}
        {detailImages.length === 0 && (
          <Text type="secondary">{VI.costumeRental.images.noImages}</Text>
        )}
      </div>
    </div>
  )
}
