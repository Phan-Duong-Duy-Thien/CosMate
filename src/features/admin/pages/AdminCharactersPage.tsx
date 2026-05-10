import { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, Tag, Image, message } from 'antd';
import type { TableProps } from 'antd';
import { TeamOutlined, SyncOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button as UiButton } from '@/components/ui/button';
import { getCharacters, syncTopAnimeCharacters, type AdminCharacter } from '../api/adminCharacters.api';

export default function AdminCharactersPage() {
  const [characters, setCharacters] = useState<AdminCharacter[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCharacters();
      setCharacters(data);
    } catch (error) {
      console.error('Failed to load characters', error);
      message.error('Không thể tải danh sách nhân vật');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCharacters();
  }, [fetchCharacters]);

  const handleSync = async () => {
    setSyncLoading(true);
    try {
      const addedCount = await syncTopAnimeCharacters();
      message.success(`Đồng bộ thành công — đã thêm ${addedCount} nhân vật mới từ Jikan API.`);
      await fetchCharacters();
    } catch (error) {
      console.error('Sync characters failed', error);
      message.error('Đồng bộ nhân vật thất bại');
    } finally {
      setSyncLoading(false);
    }
  };

  const columns: TableProps<AdminCharacter>['columns'] = useMemo(
    () => [
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
        render: (name: string) => <span className="font-semibold text-foreground">{name}</span>,
      },
      {
        title: 'Anime',
        dataIndex: 'anime',
        key: 'anime',
        render: (anime: string) => anime || <Tag>Chưa có</Tag>,
      },
    ],
    []
  );

  return (
    <>
      <style>{`
        .admin-user-row:hover { background-color: var(--muted) !important; }
      `}</style>

      <div className="flex h-full w-full flex-col">
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TeamOutlined className="text-xl text-cosmate-info" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Quản lý nhân vật</h2>
                <p className="text-sm text-muted-foreground">Đồng bộ và quản trị dữ liệu nhân vật anime/game</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <UiButton variant="cosmateOutline" disabled={loading} onClick={() => void fetchCharacters()}>
                <ReloadOutlined className={loading ? 'animate-spin' : ''} />
                Làm mới
              </UiButton>
              <UiButton variant="cosmate" disabled={syncLoading} onClick={() => void handleSync()}>
                <SyncOutlined className={syncLoading ? 'animate-spin' : ''} />
                Đồng bộ Top Anime
              </UiButton>
            </div>
          </div>
        </div>

        <Table<AdminCharacter>
          columns={columns}
          dataSource={characters}
          loading={loading}
          rowKey="id"
          rowClassName={() => 'admin-user-row'}
          pagination={{ pageSize: 20, showSizeChanger: true }}
        />
      </div>
    </>
  );
}
