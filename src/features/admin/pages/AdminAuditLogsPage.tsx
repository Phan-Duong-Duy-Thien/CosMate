import { Card, Descriptions, Empty, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getAuditLogs } from '../api/adminReports.api';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs()
      .then((data) => setLogs(data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Typography.Title level={3} style={{ marginBottom: 4 }}>Nhật ký hệ thống</Typography.Title>
        <Typography.Text type="secondary">Theo dõi các thao tác quản trị gần đây trong hệ thống.</Typography.Text>
      </div>

      <Card bordered={false} style={{ borderRadius: 16 }}>
        <Table
          rowKey={(record: any) => String(record.id ?? `${record.createdAt}-${record.action}`)}
          loading={loading}
          pagination={{ pageSize: 10 }}
          dataSource={logs}
          locale={{ emptyText: <Empty description="Chưa có nhật ký nào" /> }}
          columns={[
            {
              title: 'Thời gian',
              dataIndex: 'createdAt',
              key: 'createdAt',
              render: (value) => <span>{value ? String(value).replace('T', ' ') : '-'}</span>,
            },
            { title: 'Actor', dataIndex: 'actor', key: 'actor' },
            {
              title: 'Hành động',
              dataIndex: 'action',
              key: 'action',
              render: (value) => <Tag color="blue">{value}</Tag>,
            },
            { title: 'Đối tượng', dataIndex: 'entityType', key: 'entityType' },
            { title: 'Entity ID', dataIndex: 'entityId', key: 'entityId' },
            {
              title: 'Chi tiết',
              dataIndex: 'detail',
              key: 'detail',
              render: (value) => value ? <span style={{ whiteSpace: 'pre-wrap' }}>{value}</span> : '-',
            },
          ]}
          expandable={{
            expandedRowRender: (record: any) => (
              <Descriptions size="small" column={2} bordered>
                <Descriptions.Item label="Actor">{record.actor || '-'}</Descriptions.Item>
                <Descriptions.Item label="Action">{record.action || '-'}</Descriptions.Item>
                <Descriptions.Item label="Entity Type">{record.entityType || '-'}</Descriptions.Item>
                <Descriptions.Item label="Entity ID">{record.entityId || '-'}</Descriptions.Item>
                <Descriptions.Item label="Created At">{record.createdAt ? String(record.createdAt).replace('T', ' ') : '-'}</Descriptions.Item>
                <Descriptions.Item label="Detail" span={2}>{record.detail || '-'}</Descriptions.Item>
              </Descriptions>
            ),
          }}
        />
      </Card>
    </div>
  );
}
