import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Col, Empty, Row, Spin, Tabs, Tag, Typography, Form, Input, Button, message, Modal } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { getCharacterRequests, updateCharacterRequestStatus, createCharacter } from '../api/adminCharacterRequests.api'
import type { CharacterRequestItem } from '../api/adminCharacterRequests.api'
import { Button as UiButton } from '@/components/ui/button'

const { Text } = Typography

type FilterStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface CreateCharacterFormValues {
  name: string
  anime: string
}

export default function CharacterRequestManagement() {
  const [items, setItems] = useState<CharacterRequestItem[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createForm] = Form.useForm<CreateCharacterFormValues>()
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('PENDING')

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await getCharacterRequests())
    } catch (error) {
      console.error(error)
      message.error('Không thể tải danh sách yêu cầu nhân vật')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchItems()
  }, [fetchItems])

  const filteredItems = useMemo(() => items.filter((item) => item.status === activeFilter), [activeFilter, items])

  const handleReject = async (id: number) => {
    setActionLoadingId(id)
    try {
      await updateCharacterRequestStatus(id, 'REJECTED')
      message.success('Đã từ chối yêu cầu')
      await fetchItems()
    } catch (error) {
      console.error(error)
      message.error('Từ chối yêu cầu thất bại')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleApproveAndCreate = async (item: CharacterRequestItem) => {
    setActionLoadingId(item.id)
    try {
      await updateCharacterRequestStatus(item.id, 'APPROVED')
      await createCharacter({ name: item.characterName, anime: item.animeName })
      message.success('Đã duyệt và tạo nhân vật thành công')
      await fetchItems()
    } catch (error) {
      console.error(error)
      message.error('Duyệt và tạo nhân vật thất bại')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Quản lý yêu cầu thêm nhân vật</h2>
          <Text type="secondary">Duyệt yêu cầu từ Provider và tự động tạo nhân vật chính thức trong hệ thống.</Text>
        </div>
        <div className="flex gap-2">
          <UiButton variant="cosmateOutline" disabled={loading} onClick={() => void fetchItems()}>
            <ReloadOutlined className={loading ? 'animate-spin' : ''} />
            Làm mới
          </UiButton>
          <UiButton variant="cosmate" onClick={() => setCreateModalOpen(true)}>
            <PlusOutlined />
            Tạo nhân vật
          </UiButton>
        </div>
      </div>

      <Tabs
        activeKey={activeFilter}
        onChange={(key) => setActiveFilter(key as FilterStatus)}
        items={[
          { key: 'PENDING', label: 'Chờ duyệt' },
          { key: 'APPROVED', label: 'Đã duyệt' },
          { key: 'REJECTED', label: 'Đã từ chối' },
        ]}
      />

      {loading ? (
        <div className="flex min-h-60 items-center justify-center"><Spin /></div>
      ) : filteredItems.length === 0 ? (
        <Empty description="Không có yêu cầu nào" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredItems.map((item) => (
            <Col key={item.id} xs={24} lg={12} xl={8}>
              <Card className="border-4 border-black shadow-[6px_6px_0_0_#000]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <Tag color={item.status === 'PENDING' ? 'gold' : item.status === 'APPROVED' ? 'green' : 'red'}>{item.status}</Tag>
                    <Text type="secondary">#{item.id}</Text>
                  </div>
                  <div><b>Nhân vật:</b> {item.characterName}</div>
                  <div><b>Anime/Game:</b> {item.animeName}</div>
                  <div><b>Provider ID:</b> {item.providerId}</div>
                  <div><b>Ngày gửi:</b> {new Date(item.createdAt).toLocaleString('vi-VN')}</div>

                  {item.status === 'PENDING' && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button type="primary" icon={<CheckCircleOutlined />} loading={actionLoadingId === item.id} onClick={() => void handleApproveAndCreate(item)}>
                        Duyệt & Tạo
                      </Button>
                      <Button danger icon={<CloseCircleOutlined />} loading={actionLoadingId === item.id} onClick={() => void handleReject(item.id)}>
                        Từ chối
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        title="Tạo nhân vật"
        okText="Tạo"
        cancelText="Hủy"
        confirmLoading={createLoading}
        onOk={async () => {
          try {
            const values = await createForm.validateFields()
            setCreateLoading(true)
            await createCharacter(values)
            message.success('Tạo nhân vật thành công')
            setCreateModalOpen(false)
            createForm.resetFields()
            await fetchItems()
          } catch (error) {
            if (error instanceof Error) message.error(error.message)
          } finally {
            setCreateLoading(false)
          }
        }}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="name" label="Tên nhân vật" rules={[{ required: true, message: 'Vui lòng nhập tên nhân vật' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="anime" label="Tên Anime/Game" rules={[{ required: true, message: 'Vui lòng nhập tên anime/game' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
