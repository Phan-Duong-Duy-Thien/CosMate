interface TokenBalancePillProps {
  balance: number | null | undefined
  loading?: boolean
}

export function TokenBalancePill({ balance, loading = false }: TokenBalancePillProps) {
  return (
    <div className="inline-flex min-w-[110px] items-center justify-center gap-1 rounded-full border border-pink-200 bg-pink-50/80 px-3 py-1.5 text-sm font-semibold text-pink-700 shadow-sm sm:justify-end">
      {loading ? <span>Đang tải...</span> : <span>🪙 {typeof balance === "number" ? balance : "—"} xu</span>}
    </div>
  )
}
