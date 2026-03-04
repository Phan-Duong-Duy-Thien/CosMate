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
            {VI.costumeRental.common.edit}
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
        title={VI.costumeRental.rentalOptions.edit}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText={VI.costumeRental.common.save}
        cancelText={VI.costumeRental.common.cancel}
        confirmLoading={saving}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={VI.costumeRental.rentalOptions.form.name} rules={[{ required: true }]}>
            <Select placeholder={VI.costumeRental.rentalOptions.form.namePlaceholder}>
              {RENTAL_OPTION_NAMES.map((n) => (
                <Select.Option key={n} value={n}>
                  {n}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label={VI.costumeRental.rentalOptions.form.price}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label={VI.costumeRental.rentalOptions.form.description}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

// ─── Rental option create modal ─────────────────────────────────────────────

interface RentalOptionCreateModalProps {
  open: boolean
  onCancel: () => void
  onSubmit: (values: RentalOptionInput) => Promise<void>
  saving: boolean
}

function RentalOptionCreateModal({ open, onCancel, onSubmit, saving }: RentalOptionCreateModalProps) {
  const [form] = Form.useForm<RentalOptionInput>()

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
      title={VI.costumeRental.rentalOptions.add}
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
          label={VI.costumeRental.rentalOptions.form.name}
          rules={[{ required: true, message: VI.costumeRental.rentalOptions.form.namePlaceholder }]}
        >
          <Select placeholder={VI.costumeRental.rentalOptions.form.namePlaceholder}>
            {RENTAL_OPTION_NAMES.map((n) => (
              <Select.Option key={n} value={n}>
                {n}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="price"
          label={VI.costumeRental.rentalOptions.form.price}
          rules={[{ required: true, message: VI.costumeRental.rentalOptions.form.pricePlaceholder }]}
        >
          <InputNumber min={0} placeholder={VI.costumeRental.rentalOptions.form.pricePlaceholder} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="description" label={VI.costumeRental.rentalOptions.form.description}>
          <Input placeholder={VI.costumeRental.rentalOptions.form.descriptionPlaceholder} />
        </Form.Item>
      </Form>
    </Modal>
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
  const addRentalOptionDisabled = !canAddRentalOption(rentalOptions.length)
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

      <Divider />

      {/* Rental Options */}
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text strong>{VI.costumeRental.rentalOptions.title}</Text>
        <Button
          size="small"
          icon={<PlusOutlined />}
          disabled={addRentalOptionDisabled}
          title={addRentalOptionDisabled ? VI.costumeRental.rentalOptions.maxFourReached : undefined}
          onClick={() => setCreateRentalOptionModalOpen(true)}
        >
          {VI.costumeRental.rentalOptions.add}
        </Button>
      </Space>
      {addRentalOptionDisabled && (
        <Alert type="warning" description={VI.costumeRental.rentalOptions.maxFourReached}
          showIcon style={{ marginBottom: 8 }} />
      )}
      {rentalOptions.length === 0 ? (
        <Text type="secondary">{VI.costumeRental.rentalOptions.empty}</Text>
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
      <RentalOptionCreateModal
        open={createRentalOptionModalOpen}
        onCancel={() => setCreateRentalOptionModalOpen(false)}
        onSubmit={onCreateRentalOption}
        saving={rentalOptionSubmitting}
      />
    </div>
  )
}
