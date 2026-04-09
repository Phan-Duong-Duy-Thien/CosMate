import { useEffect } from 'react';
import { Card } from '@/shared/components/Card';
import { RotateCw } from 'lucide-react';
import { VI } from '@/shared/i18n/vi';
import { useWithdrawRequests } from '../hooks/useWithdrawRequests';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getStatusBadge(status: string) {
  const normalizedStatus = status?.toUpperCase();
  if (normalizedStatus === 'COMPLETED' || normalizedStatus === 'APPROVED') {
    return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{VI.staff.withdraw.statusCompleted}</span>;
  }
  if (normalizedStatus === 'FAILED' || normalizedStatus === 'REJECTED') {
    return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">{VI.staff.withdraw.statusFailed}</span>;
  }
  if (normalizedStatus === 'PENDING') {
    return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">{VI.staff.withdraw.statusPending}</span>;
  }
  return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">{status}</span>;
}

export default function StaffWithdrawPage() {
  const { withdrawRequests, loading, error, refetch } = useWithdrawRequests();

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{VI.staff.withdraw.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{VI.staff.withdraw.description}</p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          disabled={loading}
        >
          <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
          {VI.common.actions.refresh}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                <th className="px-4 py-3 text-sm font-medium text-slate-500">{VI.staff.withdraw.colId}</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-500">{VI.staff.withdraw.colUser}</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-500">{VI.staff.withdraw.colAmount}</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-500">{VI.staff.withdraw.colBankAccount}</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-500">{VI.staff.withdraw.colBankName}</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-500">{VI.staff.withdraw.colStatus}</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-500">{VI.staff.withdraw.colRequestedAt}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                    {VI.common.status.loading}
                  </td>
                </tr>
              ) : withdrawRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                    {VI.staff.withdraw.empty}
                  </td>
                </tr>
              ) : (
                withdrawRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">#{request.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{request.userId}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{formatCurrency(request.amount)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{request.bankAccountNumber}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{request.bankName}</td>
                    <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{formatDate(request.requestedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
