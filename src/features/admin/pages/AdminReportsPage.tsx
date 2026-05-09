import { Progress, Table, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Shirt, Store, TrendingUp, Users } from 'lucide-react';
import {
  getDashboardSummary,
  getRevenueReport,
  getOrdersReport,
  getUsersReport,
  getProvidersReport,
  getDisputesReport,
} from '../api/adminReports.api';
import {
  getDisputesReportTagColor,
  getOrdersReportTagColor,
  getProvidersReportTagColor,
  getUsersReportTagColor,
  formatDisputesReportLabel,
  formatOrdersReportLabel,
  formatProvidersReportLabel,
  formatUsersReportLabel,
} from '../utils/reportSeriesLabels';

const KPI_CARDS = [
  {
    title: 'Tổng user',
    key: 'totalUsers',
    icon: Users,
    valueClassName: 'text-cosmate-info',
    iconClassName: 'text-cosmate-info bg-cosmate-info/10',
  },
  {
    title: 'Tổng provider',
    key: 'totalProviders',
    icon: Store,
    valueClassName: 'text-cosmate-success',
    iconClassName: 'text-cosmate-success bg-cosmate-success/10',
  },
  {
    title: 'Tổng costume',
    key: 'totalCostumes',
    icon: Shirt,
    valueClassName: 'text-primary',
    iconClassName: 'text-primary bg-primary/10',
  },
  {
    title: 'Doanh thu tháng',
    key: 'revenueThisMonth',
    icon: TrendingUp,
    valueClassName: 'text-cosmate-warning',
    iconClassName: 'text-cosmate-warning bg-cosmate-warning/10',
  },
];

export default function AdminReportsPage() {
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [revenueData, setRevenueData] = useState<{ label: string; value: number | string }[]>([]);
  const [ordersData, setOrdersData] = useState<{ label: string; value: number | string }[]>([]);
  const [usersData, setUsersData] = useState<{ label: string; value: number | string }[]>([]);
  const [providersData, setProvidersData] = useState<{ label: string; value: number | string }[]>([]);
  const [disputesData, setDisputesData] = useState<{ label: string; value: number | string }[]>([]);
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
        setSummary(sum as Record<string, unknown>);
        setRevenueData((revenue || []) as { label: string; value: number | string }[]);
        setOrdersData((orders || []) as { label: string; value: number | string }[]);
        setUsersData((users || []) as { label: string; value: number | string }[]);
        setProvidersData((providers || []) as { label: string; value: number | string }[]);
        setDisputesData((disputes || []) as { label: string; value: number | string }[]);
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
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Báo cáo hệ thống</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tổng quan nhanh về hoạt động của hệ thống và các chỉ số vận hành chính.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <div
            key={card.key}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm text-muted-foreground">{card.title}</div>
              <div className={`rounded-lg p-2 ${card.iconClassName}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <div className={`mt-2 text-2xl font-bold ${card.valueClassName}`}>
              {loading ? '—' : String(summary?.[card.key] ?? 0)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-3 border-b border-border pb-2 text-base font-semibold text-foreground">
            Top doanh thu theo tháng
          </h3>
          <div className="flex flex-col gap-3">
            {topRevenue.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">{item.value.toLocaleString('vi-VN')}</span>
                </div>
                <Progress percent={item.percent} showInfo={false} strokeColor="var(--primary)" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-3 border-b border-border pb-2 text-base font-semibold text-foreground">
            Trạng thái đơn hàng
          </h3>
          <Table
            rowKey={(record: { rawKey: string }) => record.rawKey}
            loading={loading}
            pagination={false}
            size="small"
            dataSource={(ordersData || []).map((item) => {
              const rawKey = String(item.label ?? '');
              return {
                rawKey,
                labelVi: formatOrdersReportLabel(rawKey),
                color: getOrdersReportTagColor(rawKey),
                value: Number(item.value || 0),
              };
            })}
            columns={[
              {
                title: 'Trạng thái',
                dataIndex: 'labelVi',
                key: 'labelVi',
                render: (labelVi: string, row: { color: string }) => (
                  <Tag color={row.color} style={{ margin: 0 }}>{labelVi}</Tag>
                ),
              },
              { title: 'Số lượng', dataIndex: 'value', key: 'value' },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {[
          {
            title: 'Trạng thái user',
            data: usersData,
            formatLabel: formatUsersReportLabel,
            getTagColor: getUsersReportTagColor,
          },
          {
            title: 'Trạng thái provider',
            data: providersData,
            formatLabel: formatProvidersReportLabel,
            getTagColor: getProvidersReportTagColor,
          },
          {
            title: 'Trạng thái tranh chấp',
            data: disputesData,
            formatLabel: formatDisputesReportLabel,
            getTagColor: getDisputesReportTagColor,
          },
        ].map((section) => (
          <div key={section.title} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h3 className="mb-3 border-b border-border pb-2 text-base font-semibold text-foreground">{section.title}</h3>
            <Table
              rowKey={(record: { rawKey: string }) => record.rawKey}
              loading={loading}
              pagination={false}
              size="small"
              dataSource={(section.data || []).map((item) => {
                const rawKey = String(item.label ?? '');
                return {
                  rawKey,
                  labelVi: section.formatLabel(rawKey),
                  color: section.getTagColor(rawKey),
                  value: Number(item.value || 0),
                };
              })}
              columns={[
                {
                  title: 'Trạng thái',
                  dataIndex: 'labelVi',
                  key: 'labelVi',
                  render: (labelVi: string, row: { color: string }) => (
                    <Tag color={row.color} style={{ margin: 0 }}>{labelVi}</Tag>
                  ),
                },
                { title: 'Số lượng', dataIndex: 'value', key: 'value' },
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
