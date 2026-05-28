/**
 * FeesTab
 *
 * Tab B of the Edit Costume modal.
 * Shows surcharges, accessories and rental options as cards.
 * Each item has an "Edit" button that opens a small inline modal.
 * Also supports creating new surcharges, accessories and rental options.
 *
 * UI-only – no API calls. Calls onUpdateSurcharge / onUpdateRentalOption / onUpdateAccessory from hook.
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
  Switch,
  Alert,
} from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import type {
  CostumeSurcharge,
  CostumeRentalOption,
  CostumeAccessory,
  SurchargeUpdateInput,
  RentalOptionUpdateInput,
  AccessoryUpdateInput,
  RentalOptionName,
  SurchargeInput,
  RentalOptionInput,
  AccessoryInput,
} from '../../types'
import { VI } from '@/shared/i18n/vi'
import { canAddRentalOption, canAddAccessory } from '../../services/validateCostumeConstraints'

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
            {VI.costumeRental.common.edit}
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
        title={VI.costumeRental.surcharges.edit}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText={VI.costumeRental.common.save}
        cancelText={VI.costumeRental.common.cancel}
        confirmLoading={saving}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={VI.costumeRental.surcharges.form.name} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={VI.costumeRental.surcharges.form.description}>
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label={VI.costumeRental.surcharges.form.price}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

// ─── Surcharge create modal ─────────────────────────────────────────────────

interface SurchargeCreateModalProps {
  open: boolean
  onCancel: () => void
  onSubmit: (values: SurchargeInput) => Promise<void>
  saving: boolean
}

function SurchargeCreateModal({ open, onCancel, onSubmit, saving }: SurchargeCreateModalProps) {
  const [form] = Form.useForm<SurchargeInput>()

  const handleOk = async () => {
    const values = await form.validateFields()
    await onSubmit(values)
    form.resetFields()
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title={VI.costumeRental.surcharges.add}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={VI.costumeRental.common.save}
      cancelText={VI.costumeRental.common.cancel}
      confirmLoading={saving}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label={VI.costumeRental.surcharges.form.name}
          rules={[{ required: true, message: VI.costumeRental.surcharges.form.namePlaceholder }]}
        >
          <Input placeholder={VI.costumeRental.surcharges.form.namePlaceholder} />
        </Form.Item>
        <Form.Item name="description" label={VI.costumeRental.surcharges.form.description}>
          <Input placeholder={VI.costumeRental.surcharges.form.descriptionPlaceholder} />
        </Form.Item>
        <Form.Item
          name="price"
          label={VI.costumeRental.surcharges.form.price}
          rules={[{ required: true, message: VI.costumeRental.surcharges.form.pricePlaceholder }]}
        >
          <InputNumber min={0} placeholder={VI.costumeRental.surcharges.form.pricePlaceholder} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

// ─── Rental option - Fixed 4 packages: FEST, SHOOT, TEST, EVENT ─────────────────

interface RentalOptionEditProps {
  items: CostumeRentalOption[]
  onSave: (id: number, values: RentalOptionUpdateInput) => Promise<void>
  onCreate: (values: RentalOptionInput) => Promise<void>
  saving: boolean
}

const RENTAL_OPTION_LABELS: Record<RentalOptionName, string> = {
  FEST: 'Festival',
  SHOOT: 'Shooting',
  TEST: 'Thử đồ',
  EVENT: 'Sự kiện',
}

function RentalOptionSection({ items, onSave, onCreate, saving }: RentalOptionEditProps) {
  // Build a map from current items for easy lookup
  const itemsMap = new Map<RentalOptionName, CostumeRentalOption>()
  items.forEach((item) => {
    itemsMap.set(item.name as RentalOptionName, item)
  })

  const [editingName, setEditingName] = useState<RentalOptionName | null>(null)
  const [form] = Form.useForm<RentalOptionUpdateInput>()

  // Form for creating new rental option
  const [createForm] = Form.useForm<RentalOptionInput>()

  const handleEdit = (name: RentalOptionName) => {
    const item = itemsMap.get(name)
    if (item) {
      form.setFieldsValue({ name: item.name as RentalOptionName, price: item.price, description: item.description })
      setEditingName(name)
    }
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    const item = itemsMap.get(editingName!)
    if (item) {
      await onSave(item.id, values)
    }
    setEditingName(null)
  }

  const handleCancelEdit = () => {
    setEditingName(null)
    form.resetFields()
  }

  // Create modal state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [creatingName, setCreatingName] = useState<RentalOptionName | null>(null)

  const openCreateModal = (name: RentalOptionName) => {
    setCreatingName(name)
    createForm.setFieldsValue({ name, price: 0, description: '' })
    setCreateModalOpen(true)
  }

  const handleCreate = async () => {
    const values = await createForm.validateFields()
    await onCreate(values)
    setCreateModalOpen(false)
    setCreatingName(null)
  }

  return (
    <>
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

          // If editing this item
          if (editingName === name && item) {
            return (
              <Card
                key={name}
                size="small"
                title={`${name} - ${RENTAL_OPTION_LABELS[name]}`}
                style={{ borderColor: "var(--cosmate-info)" }}
              >
                <Form form={form} layout="vertical">
                  <Form.Item name="price" label={VI.costumeRental.rentalOptions.form.price} rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="description" label={VI.costumeRental.rentalOptions.form.description}>
                    <Input.TextArea rows={2} />
                  </Form.Item>
                  <Space>
                    <Button type="primary" onClick={handleSave} loading={saving}>Lưu</Button>
                    <Button onClick={handleCancelEdit}>Hủy</Button>
                  </Space>
                </Form>
              </Card>
            )
          }

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
              extra={
                item ? (
                  <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(name)}>
                    {VI.costumeRental.common.edit}
                  </Button>
                ) : (
                  <Button size="small" type="primary" onClick={() => openCreateModal(name)}>
                    Thêm mới
                  </Button>
                )
              }
              style={{
                borderColor: hasValue
                  ? "var(--cosmate-success)"
                  : "color-mix(in oklch, var(--destructive) 22%, var(--background))",
              }}
            >
              {item ? (
                <>
                  <Text type="secondary">{item.description}</Text>
                  <br />
                  <Text strong>{item.price.toLocaleString('vi-VN')} VNĐ</Text>
                </>
              ) : (
                <Text type="secondary">Chưa có thông tin gói thuê. Nhấn "Thêm mới" để nhập.</Text>
              )}
            </Card>
          )
        })}
      </Space>

      {/* Create Modal */}
      <Modal
        title={`Thêm gói thuê ${creatingName ? `- ${creatingName} - ${RENTAL_OPTION_LABELS[creatingName]}` : ''}`}
        open={createModalOpen}
        onOk={handleCreate}
        onCancel={() => { setCreateModalOpen(false); setCreatingName(null) }}
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={saving}
        destroyOnClose
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="name" label={VI.costumeRental.rentalOptions.form.name}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="price" label={VI.costumeRental.rentalOptions.form.price} rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label={VI.costumeRental.rentalOptions.form.description}>
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

// ─── Accessory edit inline modal ─────────────────────────────────────────────

interface AccessoryCardProps {
  item: CostumeAccessory
  onSave: (id: number, values: AccessoryUpdateInput) => Promise<void>
  saving: boolean
}

function AccessoryCard({ item, onSave, saving }: AccessoryCardProps) {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<AccessoryUpdateInput>()

  const handleOpen = () => {
    form.setFieldsValue({ name: item.name, description: item.description, price: item.price, isRequired: item.isRequired })
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
            {VI.costumeRental.common.edit}
          </Button>
        }
        style={{ marginBottom: 8 }}
      >
        <Text strong>{item.name}</Text>
        {item.isRequired ? (
          <Text type="danger" style={{ marginLeft: 8 }}>({VI.costumeRental.accessories.required})</Text>
        ) : (
          <Text type="secondary" style={{ marginLeft: 8 }}>({VI.costumeRental.accessories.optional})</Text>
        )}
        <br />
        <Text type="secondary">{item.description}</Text>
        <br />
        <Text>{item.price.toLocaleString('vi-VN')} VNĐ</Text>
      </Card>

      <Modal
        title={VI.costumeRental.accessories.edit}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText={VI.costumeRental.common.save}
        cancelText={VI.costumeRental.common.cancel}
        confirmLoading={saving}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={VI.costumeRental.accessories.form.name} rules={[{ required: true }]}>
            <Input placeholder={VI.costumeRental.accessories.form.namePlaceholder} />
          </Form.Item>
          <Form.Item name="description" label={VI.costumeRental.accessories.form.description}>
            <Input placeholder={VI.costumeRental.accessories.form.descriptionPlaceholder} />
          </Form.Item>
          <Form.Item
            name="price"
            label={VI.costumeRental.accessories.form.price}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} placeholder={VI.costumeRental.accessories.form.pricePlaceholder} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="isRequired"
            label={VI.costumeRental.accessories.form.isRequired}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

// ─── Accessory create modal ─────────────────────────────────────────────────

interface AccessoryCreateModalProps {
  open: boolean
  onCancel: () => void
  onSubmit: (values: AccessoryInput) => Promise<void>
  saving: boolean
}

function AccessoryCreateModal({ open, onCancel, onSubmit, saving }: AccessoryCreateModalProps) {
  const [form] = Form.useForm<AccessoryInput>()

  const handleOk = async () => {
    const values = await form.validateFields()
    await onSubmit(values)
    form.resetFields()
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title={VI.costumeRental.accessories.add}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={VI.costumeRental.common.save}
      cancelText={VI.costumeRental.common.cancel}
      confirmLoading={saving}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ isRequired: false }}>
        <Form.Item
          name="name"
          label={VI.costumeRental.accessories.form.name}
          rules={[{ required: true, message: VI.costumeRental.accessories.form.namePlaceholder }]}
        >
          <Input placeholder={VI.costumeRental.accessories.form.namePlaceholder} />
        </Form.Item>
        <Form.Item name="description" label={VI.costumeRental.accessories.form.description}>
          <Input placeholder={VI.costumeRental.accessories.form.descriptionPlaceholder} />
        </Form.Item>
        <Form.Item
          name="price"
          label={VI.costumeRental.accessories.form.price}
          rules={[{ required: true, message: VI.costumeRental.accessories.form.pricePlaceholder }]}
        >
          <InputNumber min={0} placeholder={VI.costumeRental.accessories.form.pricePlaceholder} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="isRequired"
          label={VI.costumeRental.accessories.form.isRequired}
          valuePropName="checked"
          tooltip={VI.costumeRental.accessories.form.isRequiredHint}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface FeesTabProps {
  surcharges: CostumeSurcharge[]
  rentalOptions: CostumeRentalOption[]
  accessories: CostumeAccessory[]
  numberOfItems: number
  hideRentalOptions?: boolean
  onUpdateSurcharge: (id: number, values: SurchargeUpdateInput) => Promise<void>
  onUpdateRentalOption: (id: number, values: RentalOptionUpdateInput) => Promise<void>
  onUpdateAccessory: (id: number, values: AccessoryUpdateInput) => Promise<void>
  surchargeSubmitting: boolean
  rentalOptionSubmitting: boolean
  accessorySubmitting: boolean
  // Create modal props
  createSurchargeModalOpen: boolean
  setCreateSurchargeModalOpen: (open: boolean) => void
  createRentalOptionModalOpen: boolean
  setCreateRentalOptionModalOpen: (open: boolean) => void
  createAccessoryModalOpen: boolean
  setCreateAccessoryModalOpen: (open: boolean) => void
  onCreateSurcharge: (values: SurchargeInput) => Promise<void>
  onCreateRentalOption: (values: RentalOptionInput) => Promise<void>
  onCreateAccessory: (values: AccessoryInput) => Promise<void>
}

export default function FeesTab({
  surcharges,
  rentalOptions,
  accessories,
  numberOfItems,
  hideRentalOptions = false,
  onUpdateSurcharge,
  onUpdateRentalOption,
  onUpdateAccessory,
  surchargeSubmitting,
  rentalOptionSubmitting,
  accessorySubmitting,
  createSurchargeModalOpen,
  setCreateSurchargeModalOpen,
  createRentalOptionModalOpen,
  setCreateRentalOptionModalOpen,
  createAccessoryModalOpen,
  setCreateAccessoryModalOpen,
  onCreateSurcharge,
  onCreateRentalOption,
  onCreateAccessory,
}: FeesTabProps) {
  const addAccessoryDisabled = !canAddAccessory(accessories.length, numberOfItems)

  return (
    <div>
      {/* Surcharges */}
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text strong>{VI.costumeRental.surcharges.title}</Text>
        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={() => setCreateSurchargeModalOpen(true)}
        >
          {VI.costumeRental.surcharges.add}
        </Button>
      </Space>
      {surcharges.length === 0 ? (
        <Text type="secondary">{VI.costumeRental.surcharges.empty}</Text>
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

      {/* Accessories */}
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text strong>{VI.costumeRental.accessories.title}</Text>
        <Button
          size="small"
          icon={<PlusOutlined />}
          disabled={addAccessoryDisabled}
          title={addAccessoryDisabled ? VI.costumeRental.accessories.reachedMaxItems : undefined}
          onClick={() => setCreateAccessoryModalOpen(true)}
        >
          {VI.costumeRental.accessories.add}
        </Button>
      </Space>
      {addAccessoryDisabled && (
        <Alert type="warning" description={VI.costumeRental.accessories.reachedMaxItems}
          showIcon style={{ marginBottom: 8 }} />
      )}
      {accessories.length === 0 ? (
        <Text type="secondary">{VI.costumeRental.accessories.empty}</Text>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {accessories.map((a) => (
            <AccessoryCard
              key={a.id}
              item={a}
              onSave={onUpdateAccessory}
              saving={accessorySubmitting}
            />
          ))}
        </Space>
      )}

      {!hideRentalOptions && (
        <>
          <Divider />
          {/* Rental Options - Fixed 4 packages */}
          <Text strong style={{ display: 'block', marginBottom: 8 }}>{VI.costumeRental.rentalOptions.title}</Text>
          <RentalOptionSection
            items={rentalOptions}
            onSave={onUpdateRentalOption}
            onCreate={onCreateRentalOption}
            saving={rentalOptionSubmitting}
          />
        </>
      )}

      {/* Create Modals */}
      <SurchargeCreateModal
        open={createSurchargeModalOpen}
        onCancel={() => setCreateSurchargeModalOpen(false)}
        onSubmit={onCreateSurcharge}
        saving={surchargeSubmitting}
      />
      <AccessoryCreateModal
        open={createAccessoryModalOpen}
        onCancel={() => setCreateAccessoryModalOpen(false)}
        onSubmit={onCreateAccessory}
        saving={accessorySubmitting}
      />
    </div>
  )
}
