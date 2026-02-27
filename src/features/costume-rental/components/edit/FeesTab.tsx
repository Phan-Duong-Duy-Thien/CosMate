/**
 * FeesTab
 *
 * Tab B of the Edit Costume modal.
 * Shows surcharges and rental options as cards.
 * Each item has an "Edit" button that opens a small inline modal.
 * Submits per-item immediately on modal OK (PUT per id).
 *
 * UI-only – no API calls. Calls onUpdateSurcharge / onUpdateRentalOption from hook.
 */

import { useState } from 'react'
import {
  Button,
  Card,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
  Divider,
} from 'antd'
import { EditOutlined } from '@ant-design/icons'
import type {
  CostumeSurcharge,
  CostumeRentalOption,
  SurchargeUpdateInput,
  RentalOptionUpdateInput,
  RentalOptionName,
}from '../../types'

const { Text } = Typography

const RENTAL_OPTION_NAMES: RentalOptionName[] = ['FEST', 'SHOOT', 'TEST', 'EVENT']

// ─── Surcharge edit inline modal ─────────────────────────────────────────────

interface SurchargeEditProps {
  item: CostumeSurcharge
  onSave: (id: number, values: SurchargeUpdateInput) => Promise<void>
  saving: boolean
}

function SurchargeCard({ item, onSave, saving }: SurchargeEditProps) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<SurchargeUpdateInput>()

  const handleOpen = () => {
    form.setFieldsValue({ name: item.name, description: item.description, price: item.price })
    setOpen(true)
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    await onSave(item.id, values)
    setOpen(false)
  }

  return (
    <>
      <Card
        size="small"
        extra={
          <Button size="small" icon={<EditOutlined />} onClick={handleOpen}>
            Sửa
          </Button>
        }
        style={{ marginBottom: 8 }}
      >
        <Text strong>{item.name}</Text>
        <br />
        <Text type="secondary">{item.description}</Text>
        <br />
        <Text>{item.price.toLocaleString('vi-VN')}VNĐ</Text>
      </Card>

      <Modal
        title="Sửa phụ phí"
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Huỷ"
        confirmLoading={saving}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[
              { required: true },
              { type: 'number', max: 10000, message: 'Giá phụ phí tối đa 10,000 VNĐ' },
            ]}
          >
            <InputNumber min={0} max={10000} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

// ─── Rental option edit inline modal ─────────────────────────────────────────

interface RentalOptionEditProps {
  item: CostumeRentalOption
  onSave: (id: number, values: RentalOptionUpdateInput) => Promise<void>
  saving: boolean
}

function RentalOptionCard({ item, onSave, saving }: RentalOptionEditProps) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<RentalOptionUpdateInput>()

  const handleOpen = () => {
    form.setFieldsValue({ name: item.name as RentalOptionName, price: item.price, description: item.description })
    setOpen(true)
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    await onSave(item.id, values)
    setOpen(false)
  }

  return (
    <>
      <Card
        size="small"
        extra={
          <Button size="small" icon={<EditOutlined />} onClick={handleOpen}>
            Sửa
          </Button>
        }
        style={{ marginBottom: 8 }}
      >
        <Text strong>{item.name}</Text>
        <br />
        <Text type="secondary">{item.description}</Text>
        <br />
        <Text>{item.price.toLocaleString('vi-VN')} VNĐ</Text>
      </Card>

      <Modal
        title="Sửa gói thuê"
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Huỷ"
        confirmLoading={saving}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Loại gói" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại gói">
              {RENTAL_OPTION_NAMES.map((n) => (
                <Select.Option key={n} value={n}>
                  {n}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[
              { required: true },
              { type: 'number', max: 500000, message: 'Giá gói thuê tối đa 500,000 VNĐ' },
            ]}
          >
            <InputNumber min={0} max={500000}style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface FeesTabProps {
  surcharges: CostumeSurcharge[]
  rentalOptions: CostumeRentalOption[]
  onUpdateSurcharge: (id: number, values: SurchargeUpdateInput) => Promise<void>
  onUpdateRentalOption: (id: number, values: RentalOptionUpdateInput) => Promise<void>
  surchargeSubmitting: boolean
  rentalOptionSubmitting: boolean
}

export default function FeesTab({
  surcharges,
  rentalOptions,
  onUpdateSurcharge,
  onUpdateRentalOption,
  surchargeSubmitting,
  rentalOptionSubmitting,
}: FeesTabProps) {
  return (
    <div>
      {/* Surcharges */}
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        Phụ phí
      </Text>
      {surcharges.length === 0 ? (
        <Text type="secondary">Không có phụ phí nào.</Text>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {surcharges.map((s) => (
            <SurchargeCard
              key={s.id}
              item={s}
              onSave={onUpdateSurcharge}
              saving={surchargeSubmitting}
            />
          ))}
        </Space>
      )}

      <Divider />

      {/* Rental Options */}
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        Gói thuê
      </Text>
      {rentalOptions.length === 0 ? (
        <Text type="secondary">Không có gói thuê nào.</Text>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {rentalOptions.map((r) => (
            <RentalOptionCard
              key={r.id}
              item={r}
              onSave={onUpdateRentalOption}
              saving={rentalOptionSubmitting}
            />
          ))}
        </Space>
      )}
    </div>
  )
}
