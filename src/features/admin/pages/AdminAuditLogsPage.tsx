import { Card, Descriptions, Empty, Space, Table, Tag, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getAuditLogs } from '../api/adminReports.api';

interface AuditLogRow {
  id: number;
  createdAt?: string;
  actor?: string;
  action?: string;
  entityType?: string;
  entityId?: number;
  detail?: string;
}

export default function AdminAuditLogsPage() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<AuditLogRow[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { content, totalElements } = await getAuditLogs(page, pageSize);
      setRows(content);
      setTotal(totalElements);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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
        <span style={{ color: v ? 'var(--foreground)' : 'var(--muted-foreground)', fontStyle: v ? 'normal' : 'italic' }}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (value: string | undefined) =>
        value ? <Tag style={{ margin: 0 }}>{value}</Tag> : <span style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>—</span>,
    },
    {
      title: 'Đối tượng',
      dataIndex: 'entityType',
      key: 'entityType',
      render: (v: string | undefined) => (
        <span style={{ color: 'var(--foreground)' }}>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Entity ID',
      dataIndex: 'entityId',
      key: 'entityId',
      width: 100,
      align: 'center' as const,
      render: (v: number | undefined) => (
        <span>{v ?? '—'}</span>
      ),
    },
    {
      title: 'Chi tiết',
      dataIndex: 'detail',
      key: 'detail',
      render: (value: string | undefined) =>
        value ? (
          <span style={{ whiteSpace: 'pre-wrap', color: "var(--foreground)" }}>{value}</span>
        ) : (
          <span style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>—</span>
        ),
    },
  ];

  return (
    <>
      <style>{`
        .admin-user-row:hover {
          background-color: var(--muted) !important;
        }
      `}</style>

      <div className="space-y-6">
        <div>
          <Typography.Title level={3} style={{ marginBottom: 4 }}>Nhật ký hệ thống</Typography.Title>
          <Typography.Text type="secondary">Theo dõi các thao tác quản trị gần đây trong hệ thống.</Typography.Text>
        </div>

        <Card bordered={false} style={{ borderRadius: 16 }}>
          <Table
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
        </Card>
      </div>
    </>
  );
}