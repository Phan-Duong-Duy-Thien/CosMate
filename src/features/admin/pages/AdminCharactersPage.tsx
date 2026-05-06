import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Space, Table, Tag, notification, Image } from 'antd'
import type { TableProps } from 'antd'
import { TeamOutlined, SyncOutlined } from '@ant-design/icons'
import { getCharacters, syncTopAnimeCharacters, type AdminCharacter } from '../api/adminCharacters.api'

export default function AdminCharactersPage() {
  const [characters, setCharacters] = useState<AdminCharacter[]>([])
  const [loading, setLoading] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)

  const fetchCharacters = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getCharacters()
      setCharacters(data)
    } catch (error) {
      console.error('Failed to load characters', error)
      notification.error({ message: 'Không thể tải danh sách nhân vật' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchCharacters()
  }, [fetchCharacters])

  const handleSync = async () => {
    setSyncLoading(true)
    try {
      const addedCount = await syncTopAnimeCharacters()
      notification.success({
        message: 'Đồng bộ nhân vật thành công',
        description: `Đã thêm ${addedCount} nhân vật mới từ Jikan API.`,
      })
      await fetchCharacters()
    } catch (error) {
      console.error('Sync characters failed', error)
      notification.error({ message: 'Đồng bộ nhân vật thất bại' })
    } finally {
      setSyncLoading(false)
    }
  }

  const columns: TableProps<AdminCharacter>['columns'] = useMemo(() => [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 90,
      align: 'center',
    },
    {
      title: 'Avatar',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      align: 'center',
      render: (imageUrl: string | undefined, record) => (
        <Image
          src={imageUrl || 'https://via.placeholder.com/64x64?text=No+Image'}
          alt={record.name}
          width={44}
          height={44}
          preview={false}
          style={{ borderRadius: 8, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span style={{ fontWeight: 600 }}>{name}</span>,
    },
    {
      title: 'Anime',
      dataIndex: 'anime',
      key: 'anime',
      render: (anime: string) => anime || <Tag>Chưa có</Tag>,
    },
  ], [])

  return (
    <div className="w-full h-full">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <Space size={12}>
          <TeamOutlined style={{ fontSize: 20, color: "var(--cosmate-info)" }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Quản lý Nhân vật</div>
            <div style={{ color: 'rgba(0,0,0,0.45)' }}>Đồng bộ và quản trị dữ liệu nhân vật anime/game</div>
          </div>
        </Space>

        <Button type="primary" icon={<SyncOutlined spin={syncLoading} />} onClick={handleSync} loading={syncLoading}>
          Đồng bộ Top Anime Characters
        </Button>
      </div>

      <Table<AdminCharacter>
        columns={columns}
        dataSource={characters}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 20, showSizeChanger: true }}
      />
    </div>
  )
}
