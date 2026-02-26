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
import { PlusOutlined, EditOutlined, DeleteOutlined }from '@ant-design/icons'
import type {
  SurchargeInput,
  AccessoryInput,
  RentalOptionInput,
  RentalOptionName,
} from '../../types'

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

  const openAdd = () => {
    form.resetFields()
    setEditIndex(null)
    setOpen(true)
  }

  const openEdit = (index: number) => {
    form.setFieldsValue(items[index])
    setEditIndex(index)
    setOpen(true)
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    if (editIndex !== null) {
      onUpdate(editIndex, values)
    } else {
      onAdd(values)
    }
    setOpen(false)
  }

  return (
    <div>
      <Button icon={<PlusOutlined />} onClick={openAdd} style={{ marginBottom: 16 }}>
        + Thêm phụ phí
      </Button>
      <Space direction="vertical" style={{ width: '100%' }}>
        {items.map((item, i) => (
          <Card
            key={i}
            size="small"
            extra={
              <Space>
                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(i)} />
                <Popconfirm title="Xoá phụ phí này?" onConfirm={() => onRemove(i)}>
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            }
          >
            <Text strong>{item.name}</Text>
            <br />
            <Text type="secondary">{item.description}</Text>
            <br />
            <Text>{item.price.toLocaleString('vi-VN')}VNĐ</Text>
          </Card>
        ))}
      </Space>

      <Modal
        title={editIndex !== null ? 'Sửa phụ phí' : 'Thêm phụ phí'}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Huỷ"
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
            <InputNumber min={0}max={10000}style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// ─── Accessory Tab ────────────────────────────────────────────────────────────

interface AccessoryTabProps {
  items: AccessoryInput[]
  onAdd: (item: AccessoryInput) => void
  onUpdate: (index: number, item: AccessoryInput) => void
  onRemove: (index: number) => void
}

function AccessoryTab({ items, onAdd, onUpdate, onRemove }: AccessoryTabProps) {
  const [open, setOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form] = Form.useForm<AccessoryInput>()

  const openAdd = () => {
    form.resetFields()
    setEditIndex(null)
    setOpen(true)
  }

  const openEdit = (index: number) => {
    form.setFieldsValue(items[index])
    setEditIndex(index)
    setOpen(true)
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    if (editIndex !== null) {
      onUpdate(editIndex, values)
    } else {
      onAdd(values)
    }
    setOpen(false)
  }

  return (
    <div>
      <Button icon={<PlusOutlined />} onClick={openAdd} style={{ marginBottom: 16 }}>
        + Thêm phụ kiện
      </Button>
      <Space direction="vertical" style={{ width: '100%' }}>
        {items.map((item, i) => (
          <Card
            key={i}
            size="small"
            extra={
              <Space>
                <Button size="small" icon={<EditOutlined />}onClick={() => openEdit(i)} />
                <Popconfirm title="Xoá phụ kiện này?" onConfirm={() => onRemove(i)}>
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            }
          >
            <Text strong>{item.name}</Text>
            {item.isRequired && <Text type="danger"> (Bắt buộc)</Text>}
            <br />
            <Text type="secondary">{item.description}</Text>
            <br />
            <Text>{item.price.toLocaleString('vi-VN')} VNĐ</Text>
          </Card>
        ))}
      </Space>

      <Modal
        title={editIndex !== null ? 'Sửa phụ kiện' : 'Thêm phụ kiện'}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="isRequired"
            label="Bắt buộc"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={true}>Có</Select.Option>
              <Select.Option value={false}>Không</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// ─── Rental Option Tab ────────────────────────────────────────────────────────

interface RentalOptionTabProps {
  items: RentalOptionInput[]
  onAdd: (item: RentalOptionInput) => void
  onUpdate: (index: number, item: RentalOptionInput) => void
  onRemove: (index: number) => void
}

function RentalOptionTab({ items, onAdd, onUpdate, onRemove }: RentalOptionTabProps) {
  const [open, setOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form] = Form.useForm<RentalOptionInput>()

  const openAdd = () => {
    form.resetFields()
    setEditIndex(null)
    setOpen(true)
  }

  const openEdit = (index: number) => {
    form.setFieldsValue(items[index])
    setEditIndex(index)
    setOpen(true)
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    if (editIndex !== null) {
      onUpdate(editIndex, values)
    } else {
      onAdd(values)
    }
    setOpen(false)
  }

  return (
    <div>
      <Button icon={<PlusOutlined />} onClick={openAdd} style={{ marginBottom: 16 }}>
        + Thêm gói thuê
      </Button>
      <Space direction="vertical" style={{ width: '100%' }}>
        {items.map((item, i) => (
          <Card
            key={i}
            size="small"
            extra={
              <Space>
                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(i)} />
                <Popconfirm title="Xoá gói thuê này?" onConfirm={() => onRemove(i)}>
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            }
          >
            <Text strong>{item.name}</Text>
            <br />
            <Text type="secondary">{item.description}</Text>
            <br />
            <Text>{item.price.toLocaleString('vi-VN')} VNĐ</Text>
          </Card>
        ))}
      </Space>

      <Modal
        title={editIndex !== null ? 'Sửa gói thuê' : 'Thêm gói thuê'}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Huỷ"
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
            <InputNumber min={0} max={500000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

interface Phase2BuilderTabsProps {
  surcharges: SurchargeInput[]
  accessories: AccessoryInput[]
  rentalOptions: RentalOptionInput[]
  onAddSurcharge: (item: SurchargeInput) => void
  onUpdateSurcharge: (i: number, item: SurchargeInput) => void
  onRemoveSurcharge: (i: number) => void
  onAddAccessory: (item: AccessoryInput) => void
  onUpdateAccessory: (i: number, item: AccessoryInput) => void
  onRemoveAccessory: (i: number) => void
  onAddRentalOption: (item: RentalOptionInput) => void
  onUpdateRentalOption: (i: number, item: RentalOptionInput) => void
  onRemoveRentalOption: (i: number) => void
  onFinish: () => Promise<void>
  loading: boolean
  error: string | null
}

export default function Phase2BuilderTabs({
  surcharges,
  accessories,
  rentalOptions,
  onAddSurcharge,
  onUpdateSurcharge,
  onRemoveSurcharge,
  onAddAccessory,
  onUpdateAccessory,
  onRemoveAccessory,
  onAddRentalOption,
  onUpdateRentalOption,
  onRemoveRentalOption,
  onFinish,
  loading,
  error,
}: Phase2BuilderTabsProps) {
  const tabItems = [
    {
      key: 'surcharges',
      label: 'Phụ phí',
      children: (
        <SurchargeTab
          items={surcharges}
          onAdd={onAddSurcharge}
          onUpdate={onUpdateSurcharge}
          onRemove={onRemoveSurcharge}
        />
      ),
    },
    {
      key: 'accessories',
      label: 'Phụ kiện',
      children: (
        <AccessoryTab
          items={accessories}
          onAdd={onAddAccessory}
          onUpdate={onUpdateAccessory}
          onRemove={onRemoveAccessory}
        />
      ),
    },
    {
      key: 'rentalOptions',
      label: 'Gói thuê',
      children: (
        <RentalOptionTab
          items={rentalOptions}
          onAdd={onAddRentalOption}
          onUpdate={onUpdateRentalOption}
          onRemove={onRemoveRentalOption}
        />
      ),
    },
  ]

  return (
    <div>
      <Tabs items={tabItems} />
      {error && (
        <Alert type="error" message={error}showIcon style={{ marginBottom: 16 }}/>
      )}
      <Button
        type="primary"
        size="large"
        loading={loading}
        onClick={onFinish}
        block
      >
        Hoàn tất
      </Button>
    </div>
  )
}
