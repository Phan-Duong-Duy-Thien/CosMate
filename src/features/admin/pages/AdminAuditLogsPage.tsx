import { Descriptions, Empty, Table, Tag } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { Button as UiButton } from '@/components/ui/button';
import { useAdminAuditLogs, type AuditLogRow } from '../hooks/useAdminAuditLogs';

export default function AdminAuditLogsPage() {
  const { loading, rows, total, page, setPage, pageSize, setPageSize, refetch } = useAdminAuditLogs();

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (value: string | undefined) => (
        <span>{value ? String(value).replace('T', ' ') : '—'}</span>
      ),
    },
    {
      title: 'Actor',
      dataIndex: 'actor',
      key: 'actor',
      render: (v: string | undefined) => (
        <span className={v ? 'text-foreground' : 'text-muted-foreground italic'}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (value: string | undefined) =>
        value ? (
          <Tag style={{ margin: 0 }}>{value}</Tag>
        ) : (
          <span className="text-muted-foreground italic">—</span>
        ),
    },
    {
      title: 'Đối tượng',
      dataIndex: 'entityType',
      key: 'entityType',
      render: (v: string | undefined) => <span className="text-foreground">{v ?? '—'}</span>,
    },
    {
      title: 'Entity ID',
      dataIndex: 'entityId',
      key: 'entityId',
      width: 100,
      align: 'center' as const,
      render: (v: number | undefined) => <span>{v ?? '—'}</span>,
    },
    {
      title: 'Chi tiết',
      dataIndex: 'detail',
      key: 'detail',
      render: (value: string | undefined) =>
        value ? (
          <span className="whitespace-pre-wrap text-foreground">{value}</span>
        ) : (
          <span className="text-muted-foreground italic">—</span>
        ),
    },
  ];

  return (
    <>
      <style>{`
        .admin-user-row:hover { background-color: var(--muted) !important; }
      `}</style>

      <div className="flex h-full w-full flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Nhật ký hệ thống</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi các thao tác quản trị gần đây trong hệ thống.
          </p>
        </div>

        <div className="mb-2 flex flex-wrap justify-end gap-4">
          <UiButton variant="cosmateOutline" disabled={loading} onClick={() => void refetch()}>
            <ReloadOutlined className={loading ? 'animate-spin' : ''} />
            Làm mới
          </UiButton>
        </div>

        <Table<AuditLogRow>
          rowKey="id"
          loading={loading}
          dataSource={rows}
          columns={columns}
          pagination={{
            current: page,
            pageSize,
            total,
            showTotal: (t) => `Tổng ${t} nhật ký`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
          rowClassName={() => 'admin-user-row'}
          expandable={{
            expandedRowRender: (record: AuditLogRow) => (
              <Descriptions size="small" column={2} bordered>
                <Descriptions.Item label="Actor">{record.actor || '—'}</Descriptions.Item>
                <Descriptions.Item label="Action">{record.action || '—'}</Descriptions.Item>
                <Descriptions.Item label="Entity Type">{record.entityType || '—'}</Descriptions.Item>
                <Descriptions.Item label="Entity ID">{record.entityId ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {record.createdAt ? String(record.createdAt).replace('T', ' ') : '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Detail" span={2}>
                  {record.detail || '—'}
                </Descriptions.Item>
              </Descriptions>
            ),
          }}
          locale={{ emptyText: <Empty description="Chưa có nhật ký nào" /> }}
        />
      </div>
    </>
  );
}
