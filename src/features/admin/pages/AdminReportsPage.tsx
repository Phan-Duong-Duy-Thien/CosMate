import { Card, Col, Progress, Row, Statistic, Table, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getDashboardSummary, getRevenueReport, getOrdersReport, getUsersReport, getProvidersReport, getDisputesReport } from '../api/adminReports.api';

const KPI_CARDS = [
  { title: 'Tổng user', key: 'totalUsers' },
  { title: 'Tổng provider', key: 'totalProviders' },
  { title: 'Tổng costume', key: 'totalCostumes' },
  { title: 'Doanh thu tháng', key: 'revenueThisMonth' },
];

export default function AdminReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [providersData, setProvidersData] = useState<any[]>([]);
  const [disputesData, setDisputesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardSummary(),
      getRevenueReport(),
      getOrdersReport(),
      getUsersReport(),
      getProvidersReport(),
      getDisputesReport(),
    ])
      .then(([sum, revenue, orders, users, providers, disputes]) => {
        setSummary(sum);
        setRevenueData(revenue || []);
        setOrdersData(orders || []);
        setUsersData(users || []);
        setProvidersData(providers || []);
        setDisputesData(disputes || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const topRevenue = useMemo(() => {
    const sorted = [...revenueData].sort((a, b) => Number(b.value || 0) - Number(a.value || 0));
    const max = Number(sorted[0]?.value || 1);
    return sorted.slice(0, 8).map((item) => ({
      label: item.label,
      value: Number(item.value || 0),
      percent: max > 0 ? Math.round((Number(item.value || 0) / max) * 100) : 0,
    }));
  }, [revenueData]);

  return (
    <div className="space-y-6">
      <div>
        <Typography.Title level={3} style={{ marginBottom: 4 }}>Báo cáo hệ thống</Typography.Title>
        <Typography.Text type="secondary">Tổng quan nhanh về hoạt động của hệ thống và các chỉ số vận hành chính.</Typography.Text>
      </div>

      <Row gutter={[16, 16]}>
        {KPI_CARDS.map((card) => (
          <Col key={card.key} xs={24} sm={12} xl={6}>
            <Card bordered={false} style={{ borderRadius: 16 }}>
              <Statistic title={card.title} value={summary?.[card.key] ?? 0} loading={loading} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card bordered={false} style={{ borderRadius: 16 }} title="Top doanh thu theo tháng (dạng cột tiến độ)">
            <div className="space-y-3">
              {topRevenue.map((item) => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Typography.Text>{item.label}</Typography.Text>
                    <Typography.Text strong>{item.value.toLocaleString('vi-VN')}</Typography.Text>
                  </div>
                  <Progress percent={item.percent} showInfo={false} strokeColor="var(--primary)" />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card bordered={false} style={{ borderRadius: 16 }} title="Trạng thái đơn hàng">
            <Table
              rowKey={(record: any) => String(record.label)}
              loading={loading}
              pagination={false}
              size="small"
              dataSource={(ordersData || []).map((item) => ({
                label: item.label,
                value: Number(item.value || 0),
              }))}
              columns={[
                { title: 'Trạng thái', dataIndex: 'label', key: 'label' },
                { title: 'Số lượng', dataIndex: 'value', key: 'value' },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={8}>
          <Card bordered={false} style={{ borderRadius: 16 }} title="Trạng thái user">
            <Table
              rowKey={(record: any) => String(record.label)}
              loading={loading}
              pagination={false}
              size="small"
              dataSource={(usersData || []).map((item) => ({
                label: item.label,
                value: Number(item.value || 0),
              }))}
              columns={[
                { title: 'Trạng thái', dataIndex: 'label', key: 'label' },
                { title: 'Số lượng', dataIndex: 'value', key: 'value' },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card bordered={false} style={{ borderRadius: 16 }} title="Trạng thái provider">
            <Table
              rowKey={(record: any) => String(record.label)}
              loading={loading}
              pagination={false}
              size="small"
              dataSource={(providersData || []).map((item) => ({
                label: item.label,
                value: Number(item.value || 0),
              }))}
              columns={[
                { title: 'Trạng thái', dataIndex: 'label', key: 'label' },
                { title: 'Số lượng', dataIndex: 'value', key: 'value' },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card bordered={false} style={{ borderRadius: 16 }} title="Trạng thái tranh chấp">
            <Table
              rowKey={(record: any) => String(record.label)}
              loading={loading}
              pagination={false}
              size="small"
              dataSource={(disputesData || []).map((item) => ({
                label: item.label,
                value: Number(item.value || 0),
              }))}
              columns={[
                { title: 'Trạng thái', dataIndex: 'label', key: 'label' },
                { title: 'Số lượng', dataIndex: 'value', key: 'value' },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
