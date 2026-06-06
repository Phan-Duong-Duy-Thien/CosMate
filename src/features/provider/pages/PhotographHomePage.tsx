/**
 * Photograph Provider Home Page
 * Portal entry page for PROVIDER_PHOTOGRAPH role.
 * Uses DashboardLayout + subscription gating via useProviderGate.
 */
import { useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Typography, Spin, Select, Alert } from 'antd';
import { ShoppingBag, CheckCircle2, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import { photographSidebarItems } from '../constants/sidebar';
import { VI } from '@/shared/i18n/vi';
import { useProviderStatistics } from '../hooks/useProviderStatistics';
import { ProviderRevenueChart } from '../components/ProviderRevenueChart';

const MONTHS_OPTIONS = [3, 6, 12] as const;

export default function PhotographHomePage() {
  const navigate = useNavigate();
  const [chartMonths, setChartMonths] = useState<number>(6);

  const { statistics, loading: statsLoading, error: statsError, refetch } =
    useProviderStatistics(chartMonths);

  const sidebarItems: DashboardSidebarItem[] = photographSidebarItems.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    };
  });

  const stats = useMemo(() => {
    const s = statistics;
    return [
      {
        title: VI.provider.dashboard.stats.totalOrders,
        value: s?.totalOrders ?? 0,
        icon: <ShoppingBag size={24} />,
        color: 'var(--cosmate-pink)',
      },
      {
        title: VI.provider.dashboard.stats.completedOrders,
        value: s?.completedOrders ?? 0,
        icon: <CheckCircle2 size={24} />,
        color: 'var(--cosmate-success)',
      },
      {
        title: VI.provider.dashboard.stats.totalRevenue,
        value: s?.totalRevenue ?? 0,
        icon: <Banknote size={24} />,
        color: 'var(--cosmate-warning)',
        suffix: 'đ',
      },
    ];
  }, [statistics]);

  return (
    <DashboardLayout title={VI.provider.dashboardPhotograph.title} sidebarItems={sidebarItems} brandName="CosMate Photographer" showChatButton={false}>
        <>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{VI.provider.dashboardPhotograph.welcome}</h2>
              <p className="text-muted-foreground text-[13px]">{VI.provider.dashboardPhotograph.overview}</p>
            </div>
            <Space>
              <span className="text-sm text-muted-foreground">{VI.provider.dashboard.charts.monthsFilter}</span>
              <Select
                value={chartMonths}
                onChange={setChartMonths}
                style={{ width: 160 }}
                options={MONTHS_OPTIONS.map((m) => ({
                  value: m,
                  label: VI.provider.dashboard.charts.monthsOption.replace('{count}', String(m)),
                }))}
              />
              <Button onClick={() => void refetch()} loading={statsLoading}>
                {VI.common.actions.refresh}
              </Button>
            </Space>
          </div>

          {statsError && (
            <Alert
              type="error"
              message={statsError}
              className="mb-4"
              showIcon
            />
          )}

          {statsLoading && !statistics ? (
            <div className="py-12 text-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <Row gutter={[12, 12]}>
                {stats.map((stat, index) => (
                  <Col xs={24} sm={12} lg={8} key={index}>
                    <Card
                      bordered={false}
                      style={{
                        borderRadius: 10,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Statistic
                          title={stat.title}
                          value={stat.value}
                          suffix={stat.suffix}
                          valueStyle={{ color: stat.color, fontSize: 22, fontWeight: 700 }}
                        />
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            backgroundColor: `color-mix(in oklch, ${stat.color} 14%, transparent)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: stat.color,
                          }}
                        >
                          {stat.icon}
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={12}>
                  <Card
                    title={VI.provider.dashboard.charts.revenueByMonth}
                    bordered={false}
                    style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                  >
                    <ProviderRevenueChart
                      title=""
                      data={statistics?.revenueByMonth ?? []}
                      emptyText={VI.provider.dashboard.charts.noData}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    title={VI.provider.dashboard.charts.revenueByQuarter}
                    bordered={false}
                    style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                  >
                    <ProviderRevenueChart
                      title=""
                      data={statistics?.revenueByQuarter ?? []}
                      emptyText={VI.provider.dashboard.charts.noData}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Card
                    title={VI.provider.dashboard.sections.quickTips}
                    bordered={false}
                    style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                  >
                    <ul className="mb-0 text-muted-foreground">
                      {VI.provider.dashboard.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </>
    </DashboardLayout>
  );
}
