import { Card, Col, Empty, Row, Statistic, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getDashboardSummary, getRevenueReport, getOrdersReport, getUsersReport, getProvidersReport, getDisputesReport } from '../api/adminReports.api';

const KPI_CARDS = [
  { title: 'Tổng user', key: 'totalUsers' },
  { title: 'Tổng provider', key: 'totalProviders' },
  { title: 'Tổng costume', key: 'totalCostumes' },
  { title: 'Doanh thu tháng', key: 'revenueThisMonth' },
];

export default function AdminReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardSummary(), getRevenueReport(), getOrdersReport(), getUsersReport(), getProvidersReport(), getDisputesReport()])
      .then(([sum]) => setSummary(sum))
      .finally(() => setLoading(false));
  }, []);

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

      <Card bordered={false} style={{ borderRadius: 16 }} title="Biểu đồ và thống kê chi tiết">
        <Empty description="API báo cáo đã được nối, phần hiển thị chart sẽ làm tiếp sau" />
      </Card>
    </div>
  );
}
