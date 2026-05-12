/**
 * DisputeList Component
 * Displays filtered dispute list with loading/empty states
 */
import React from 'react';
import { RotateCw, AlertTriangle } from 'lucide-react';
import { Card } from '@/shared/components/Card';
import { DisputeCard } from './DisputeCard';
import type { Dispute, DisputeFilter } from '../types/dispute.type';
import { VI } from '@/shared/i18n/vi';

interface DisputeListProps {
  disputes: Dispute[];
  loading: boolean;
  error: string | null;
  filter: DisputeFilter;
  onFilterChange: (filter: DisputeFilter) => void;
  onRefresh: () => void;
  onCardClick: (dispute: Dispute) => void;
}

const FILTER_OPTIONS: { value: DisputeFilter; label: string }[] = [
  { value: 'ALL', label: VI.staff.disputes.filterAll },
  { value: 'OPEN', label: VI.staff.disputes.filterOpen },
  { value: 'RESOLVED', label: VI.staff.disputes.filterResolved },
  { value: 'REJECTED', label: VI.staff.disputes.filterRejected },
];

export function DisputeList({
  disputes,
  loading,
  error,
  filter,
  onFilterChange,
  onRefresh,
  onCardClick,
}: DisputeListProps) {
  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFilterChange(opt.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === opt.value
                  ? 'bg-pink-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void onRefresh()}
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

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RotateCw size={32} className="animate-spin text-slate-400" />
        </div>
      ) : disputes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <AlertTriangle size={40} className="text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">{VI.staff.disputes.empty}</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {disputes.map((dispute) => (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              onClick={onCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}