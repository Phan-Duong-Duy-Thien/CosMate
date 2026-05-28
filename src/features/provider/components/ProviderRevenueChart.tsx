/**
 * Presentational bar chart for provider revenue series.
 */
type ChartPoint = {
  label: string;
  value: number;
};

type ProviderRevenueChartProps = {
  title: string;
  data: ChartPoint[];
  emptyText: string;
  valueSuffix?: string;
};

function formatValue(value: number, suffix?: string): string {
  const formatted = value.toLocaleString('vi-VN');
  return suffix ? `${formatted}${suffix}` : formatted;
}

export function ProviderRevenueChart({
  title,
  data,
  emptyText,
  valueSuffix = 'đ',
}: ProviderRevenueChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  if (data.length === 0) {
    return (
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">{title}</h4>
        <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  return (
    <div>
      {title ? <h4 className="mb-4 text-sm font-semibold text-foreground">{title}</h4> : null}
      <div className="flex h-48 items-end gap-2 sm:gap-3">
        {data.map((point) => {
          const heightPct = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
          return (
            <div
              key={point.label}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
              title={`${point.label}: ${formatValue(point.value, valueSuffix)}`}
            >
              <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
                {point.value > 0 ? formatValue(point.value, valueSuffix) : '—'}
              </span>
              <div className="flex h-32 w-full items-end justify-center">
                <div
                  className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-violet-600 to-pink-400 transition-all"
                  style={{ height: `${Math.max(heightPct, point.value > 0 ? 4 : 0)}%` }}
                />
              </div>
              <span className="w-full truncate text-center text-[10px] font-semibold text-muted-foreground sm:text-xs">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
