/**
 * Phase2BuilderTabs
 *
 * Tabbed UI for adding surcharges, accessories, and rental options.
 * Stores items locally; submits via onFinish callback.
 * Never calls API directly.
 */

import { useState } from 'react'
import {
  Tabs,
  Button,
  Card,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
  Alert,
  Popconfirm,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type {
  SurchargeInput,
  AccessoryInput,
  RentalOptionInput,
  RentalOptionName,
} from '../../types'
import { canAddRentalOption, canAddAccessory } from '../../services/validateCostumeConstraints'
import { VI } from '@/shared/i18n/vi'

const { Text } = Typography

const RENTAL_OPTION_NAMES: RentalOptionName[] = ['FEST', 'SHOOT', 'TEST', 'EVENT']

// ─── Surcharge Tab ────────────────────────────────────────────────────────────

interface SurchargeTabProps {
  items: SurchargeInput[]
  onAdd: (item: SurchargeInput) => void
  onUpdate: (index: number, item: SurchargeInput) => void
  onRemove: (index: number) => void
}

function SurchargeTab({ items, onAdd, onUpdate, onRemove }: SurchargeTabProps) {
  const [open, setOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form] = Form.useForm<SurchargeInput>()

  const openAdd = () => { form.resetFields(); setEditIndex(null); setOpen(true) }
  const openEdit = (index: number) => { form.setFieldsValue(items[index]); setEditIndex(index); setOpen(true) }
  const handleOk = async () => {
    const values = await form.validateFields()
    editIndex !== null ? onUpdate(editIndex, values) : onAdd(values)
    setOpen(false)
  }

  return (
    <div>
      <Button icon={<PlusOutlined />} onClick={openAdd} style={{ marginBottom: 16 }}>
        {VI.costumeRental.surcharges.add}
      </Button>
      <Space direction="vertical" style={{ width: '100%' }}>
        {items.map((item, i) => (
          <Card key={i} size="small" extra={
            <Space>
              <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(i)} />
              <Popconfirm title={VI.costumeRental.surcharges.form.name} onConfirm={() => onRemove(i)}>
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          }>
            <Text strong>{item.name}</Text><br />
            <Text type="secondary">{item.description}</Text><br />
            <Text>{item.price.toLocaleString('vi-VN')} VNĐ</Text>
          </Card>
        ))}
      </Space>
      <Modal title={editIndex !== null ? VI.costumeRental.surcharges.edit : VI.costumeRental.surcharges.add}
        open={open} onOk={handleOk} onCancel={() => setOpen(false)}
        okText={VI.costumeRental.common.save} cancelText={VI.costumeRental.common.cancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={VI.costumeRental.surcharges.form.name} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={VI.costumeRental.surcharges.form.description}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label={VI.costumeRental.surcharges.form.price}
            rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// ─── Accessory Tab ────────────────────────────────────────────────────────────

interface AccessoryTabProps {
  items: AccessoryInput[]
  numberOfItems: number
  onAdd: (item: AccessoryInput) => void
  onUpdate: (index: number, item: AccessoryInput) => void
  onRemove: (index: number) => void
}

function AccessoryTab({ items, numberOfItems, onAdd, onUpdate, onRemove }: AccessoryTabProps) {
  const [open, setOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form] = Form.useForm<AccessoryInput>()
  const addDisabled = !canAddAccessory(items.length, numberOfItems)

  const openAdd = () => { form.resetFields(); setEditIndex(null); setOpen(true) }
  const openEdit = (index: number) => { form.setFieldsValue(items[index]); setEditIndex(index); setOpen(true) }
  const handleOk = async () => {
    const values = await form.validateFields()
    editIndex !== null ? onUpdate(editIndex, values) : onAdd(values)
    setOpen(false)
  }

  return (
    <div>
      <Button icon={<PlusOutlined />} onClick={openAdd} disabled={addDisabled}
        title={addDisabled ? VI.costumeRental.accessories.reachedMaxItems : undefined}
        style={{ marginBottom: 16 }}>
        {VI.costumeRental.accessories.add}
      </Button>
      {addDisabled && (
        <Alert type="warning" message={VI.costumeRental.accessories.reachedMaxItems}
          showIcon style={{ marginBottom: 12 }} />
      )}
      <Space direction="vertical" style={{ width: '100%' }}>
        {items.map((item, i) => (
          <Card key={i} size="small" extra={
            <Space>
              <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(i)} />
              <Popconfirm title={VI.costumeRental.accessories.form.name} onConfirm={() => onRemove(i)}>
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          }>
            <Text strong>{item.name}</Text>
            {item.isRequired && <Text type="danger"> ({VI.costumeRental.accessories.required})</Text>}
            <br />
            <Text type="secondary">{item.description}</Text><br />
            <Text>{item.price.toLocaleString('vi-VN')} VNĐ</Text>
          </Card>
        ))}
      </Space>
      <Modal title={editIndex !== null ? VI.costumeRental.accessories.edit : VI.costumeRental.accessories.add}
        open={open} onOk={handleOk} onCancel={() => setOpen(false)}
        okText={VI.costumeRental.common.save} cancelText={VI.costumeRental.common.cancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={VI.costumeRental.accessories.form.name} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={VI.costumeRental.accessories.form.description}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label={VI.costumeRental.accessories.form.price} rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="isRequired" label={VI.costumeRental.accessories.form.isRequired} rules={[{ required: true }]}>
            <Select>
              <Select.Option value={true}>{VI.costumeRental.accessories.required}</Select.Option>
              <Select.Option value={false}>{VI.costumeRental.accessories.optional}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// ─── Rental Option Tab ────────────────────────────────────────────────────────
// Fixed 4 rental packages: FEST, SHOOT, TEST, EVENT
// No add/remove - each package is always visible

interface RentalOptionTabProps {
  items: RentalOptionInput[]
  onAdd: (item: RentalOptionInput) => void
  onUpdate: (index: number, item: RentalOptionInput) => void
}

const RENTAL_OPTION_LABELS: Record<RentalOptionName, string> = {
  FEST: 'Festival',
  SHOOT: 'Shooting',
  TEST: 'Thử đồ',
  EVENT: 'Sự kiện',
}

function RentalOptionTab({ items, onAdd, onUpdate }: RentalOptionTabProps) {
  // Build a map from current items for easy lookup
  const itemsMap = new Map<RentalOptionName, RentalOptionInput>()
  items.forEach((item) => {
    itemsMap.set(item.name, item)
  })

  const handleChange = (name: RentalOptionName, field: 'price' | 'description', value: number | string) => {
    const existing = itemsMap.get(name)
    const updated: RentalOptionInput = {
      name,
      price: field === 'price' ? (value as number) : (existing?.price ?? 0),
      description: field === 'description' ? (value as string) : (existing?.description ?? ''),
    }
    // Find index in items array
    const idx = items.findIndex((item) => item.name === name)
    if (idx >= 0) {
      onUpdate(idx, updated)
    } else {
      // If not exists yet, add it
      onAdd(updated)
    }
  }

  // Ensure we have entries for all 4 types
  const getValue = (name: RentalOptionName, field: 'price' | 'description'): number | string => {
    const item = itemsMap.get(name)
    if (item) {
      return field === 'price' ? item.price : item.description
    }
    return field === 'price' ? 0 : ''
  }

  return (
    <div>
      <Alert
        type="info"
        message="Bắt buộc phải nhập đầy đủ thông tin cho cả 4 gói thuê"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {RENTAL_OPTION_NAMES.map((name) => {
          const item = itemsMap.get(name)
          const hasValue = item && (item.price > 0 || item.description)

          return (
            <Card
              key={name}
              size="small"
              title={
                <span>
                  {name} - {RENTAL_OPTION_LABELS[name]}
                  {!hasValue && <Text type="danger" style={{ marginLeft: 8 }}>(Chưa nhập)</Text>}
                </span>
              }
              style={{ borderColor: hasValue ? '#52c41a' : '#ffccc7' }}
            >
              <Form layout="vertical">
                <Form.Item
                  label={VI.costumeRental.rentalOptions.form.price}
                  required
                  style={{ marginBottom: 12 }}
                >
                  <InputNumber
                    min={0}
                    value={getValue(name, 'price')}
                    onChange={(value) => handleChange(name, 'price', value ?? 0)}
                    style={{ width: '100%' }}
                    placeholder="Nhập giá thuê"
                  />
                </Form.Item>
                <Form.Item label={VI.costumeRental.rentalOptions.form.description}>
                  <Input.TextArea
                    value={getValue(name, 'description')}
                    onChange={(e) => handleChange(name, 'description', e.target.value)}
                    placeholder="Mô tả gói thuê (thời gian, điều kiện...)"
                    rows={2}
                  />
                </Form.Item>
              </Form>
            </Card>
          )
        })}
      </Space>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

interface Phase2BuilderTabsProps {
  surcharges: SurchargeInput[]
  accessories: AccessoryInput[]
  rentalOptions: RentalOptionInput[]
  numberOfItems: number
  onAddSurcharge: (item: SurchargeInput) => void
  onUpdateSurcharge: (i: number, item: SurchargeInput) => void
  onRemoveSurcharge: (i: number) => void
  onAddAccessory: (item: AccessoryInput) => void
  onUpdateAccessory: (i: number, item: AccessoryInput) => void
  onRemoveAccessory: (i: number) => void
  onAddRentalOption: (item: RentalOptionInput) => void
  onUpdateRentalOption: (i: number, item: RentalOptionInput) => void
  onFinish: () => Promise<void>
  loading: boolean
  error: string | null
}

export default function Phase2BuilderTabs({
  surcharges,
  accessories,
  rentalOptions,
  numberOfItems,
  onAddSurcharge,
  onUpdateSurcharge,
  onRemoveSurcharge,
  onAddAccessory,
  onUpdateAccessory,
  onRemoveAccessory,
  onAddRentalOption,
  onUpdateRentalOption,
  onFinish,
  loading,
  error,
}: Phase2BuilderTabsProps) {
  const tabItems = [
    {
      key: 'surcharges',
      label: VI.costumeRental.surcharges.title,
      children: (
        <SurchargeTab items={surcharges} onAdd={onAddSurcharge}
          onUpdate={onUpdateSurcharge} onRemove={onRemoveSurcharge} />
      ),
    },
    {
      key: 'accessories',
      label: VI.costumeRental.accessories.title,
      children: (
        <AccessoryTab items={accessories} numberOfItems={numberOfItems}
          onAdd={onAddAccessory} onUpdate={onUpdateAccessory} onRemove={onRemoveAccessory} />
      ),
    },
    {
      key: 'rentalOptions',
      label: VI.costumeRental.rentalOptions.title,
      children: (
        <RentalOptionTab items={rentalOptions} onAdd={onAddRentalOption} onUpdate={onUpdateRentalOption} />
      ),
    },
  ]

  return (
    <div>
      <Tabs items={tabItems} />
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      <Button type="primary" size="large" loading={loading} onClick={onFinish} block>
        {VI.costumeRental.common.save}
      </Button>
    </div>
  )
}
