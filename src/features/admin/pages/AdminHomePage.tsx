import { Skeleton } from 'antd';
import { Statistic } from 'antd';
import { Users, ShoppingBag, Shirt, TrendingUp } from 'lucide-react';
import { VI } from '@/shared/i18n/vi';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

const DASHBOARD_STATS = (summary: Record<string, unknown> | null) => [
  { title: VI.admin.dashboard.stats.totalUsers, value: summary?.totalUsers ?? 0, icon: <Users size={24} />, color: 'var(--primary)' },
  { title: VI.admin.dashboard.stats.activeBookings, value: summary?.totalOrders ?? 0, icon: <ShoppingBag size={24} />, color: 'var(--cosmate-pink)' },
  { title: VI.admin.dashboard.stats.totalCostumes, value: summary?.totalCostumes ?? 0, icon: <Shirt size={24} />, color: 'var(--cosmate-success)' },
  { title: VI.admin.dashboard.stats.revenue, value: summary?.revenueThisMonth ?? 0, icon: <TrendingUp size={24} />, color: 'var(--cosmate-warning)', prefix: '₫' },
];

export default function AdminHomePage() {
  const { summary, loading } = useAdminDashboard();
  const stats = DASHBOARD_STATS(summary);

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">{VI.admin.dashboard.welcome}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{VI.admin.dashboard.todayOverview}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            {loading ? (
              <Skeleton active paragraph={false} />
            ) : (
              <div className="flex items-center justify-between gap-3">
                <Statistic
                  title={stat.title}
                  value={stat.value as number}
                  prefix={stat.prefix}
                  valueStyle={{ color: stat.color, fontSize: 22, fontWeight: 700 }}
                />
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-[10px]"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${stat.color} 14%, transparent)`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
