import { Link } from 'react-router-dom';
import { Card } from '@/shared/components/Card';
import { VI } from '@/shared/i18n/vi';
import { LayoutDashboard, CalendarCheck, TrendingUp, Users } from 'lucide-react';

export default function StaffHomePage() {
  const stats = [
    { label: 'Đơn hôm nay', value: 5, icon: CalendarCheck, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Đơn tuần này', value: 23, icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Khách hàng', value: 42, icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Đánh giá', value: 4.8, icon: LayoutDashboard, color: 'text-pink-600', bgColor: 'bg-pink-50', suffix: '/5' },
  ];

  const recentBookings = [
    { id: 1, customer: 'Nguyễn Văn A', service: 'Hỗ trợ sự kiện Cosplay', date: '10/04/2026', status: 'pending', time: '14:00 - 18:00' },
    { id: 2, customer: 'Trần Thị B', service: 'Hỗ trợ booth trưng bày', date: '12/04/2026', status: 'confirmed', time: '09:00 - 17:00' },
    { id: 3, customer: 'Lê Minh C', service: 'Hỗ trợ sự kiện Cosplay', date: '14/04/2026', status: 'pending', time: '10:00 - 20:00' },
    { id: 4, customer: 'Phạm Hoàng D', service: 'Hỗ trợ chụp ảnh ngoài trời', date: '15/04/2026', status: 'completed', time: '08:00 - 12:00' },
  ];

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      pending: { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-700' },
      confirmed: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Hoàn thành', className: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-700' },
    };
    const config = map[status] || { label: status, className: 'bg-slate-100 text-slate-700' };
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>{config.label}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{VI.staff.home.welcome}</h2>
        <p className="mt-1 text-sm text-slate-600">{VI.staff.home.overview}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stat.value}{stat.suffix}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{VI.staff.home.recentBookings}</h3>
          <Link to="/staff/bookings" className="text-sm font-medium text-pink-500 hover:text-pink-600">
            {VI.common.actions.viewMore}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="pb-3 text-sm font-medium text-slate-500">{VI.staff.home.tableCustomer}</th>
                <th className="pb-3 text-sm font-medium text-slate-500">{VI.staff.home.tableService}</th>
                <th className="pb-3 text-sm font-medium text-slate-500">{VI.staff.home.tableDate}</th>
                <th className="pb-3 text-sm font-medium text-slate-500">{VI.staff.home.tableTime}</th>
                <th className="pb-3 text-sm font-medium text-slate-500">{VI.staff.home.tableStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="py-3 text-sm font-medium text-slate-900">{booking.customer}</td>
                  <td className="py-3 text-sm text-slate-600">{booking.service}</td>
                  <td className="py-3 text-sm text-slate-600">{booking.date}</td>
                  <td className="py-3 text-sm text-slate-600">{booking.time}</td>
                  <td className="py-3">{getStatusBadge(booking.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
