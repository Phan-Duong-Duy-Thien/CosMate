import { useNavigate, useLocation } from "react-router-dom"
import { ChevronDown, History } from "lucide-react"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import { useWallet } from "../hooks/useWallet"

type WalletPageProps = {
  /** Base wallet path derived from current provider role (e.g. "/provider-photograph/wallet").
   *  When omitted, defaults to "/profile/wallet" for the cosplayer site. */
  walletBase?: string
}

// Format currency to VND
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

// Format date to readable format
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Get status color class
function getStatusColor(status: string): string {
  const normalizedStatus = status?.toUpperCase()
  if (normalizedStatus === "COMPLETED") return "bg-cosmate-success/15 text-cosmate-success"
  if (normalizedStatus === "FAILED") return "bg-destructive/10 text-destructive"
  if (normalizedStatus === "PENDING") return "bg-cosmate-warning/15 text-cosmate-warning"
  return "bg-muted text-muted-foreground"
}

// Get status label
function getStatusLabel(status: string): string {
  const normalizedStatus = status?.toUpperCase()
  if (normalizedStatus === "COMPLETED") return VI.wallet.statusCompleted
  if (normalizedStatus === "FAILED") return VI.wallet.statusFailed
  if (normalizedStatus === "PENDING") return VI.wallet.statusPending
  return status
}

// Get transaction type label
function getTransactionTypeLabel(type: string): string {
  const normalizedType = type?.toUpperCase()

  // CREDIT = Nap tien vao vi
  if (normalizedType === "CREDIT") return VI.wallet.typeTopUp

  // ORDER#xxx = Thanh toan don thue
  if (normalizedType?.startsWith("ORDER")) return VI.wallet.typePayment

  // REFUND = Hoan tien
  if (normalizedType === "REFUND") return VI.wallet.typeRefund

  // DEPOSIT = Dat coc
  if (normalizedType === "DEPOSIT") return VI.wallet.typeDeposit

  return VI.wallet.typeOther
}

export default function WalletPage({ walletBase = "/profile/wallet" }: WalletPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    walletInfo,
    transactions,
    loadingWallet,
    loadingTransactions,
    isTransactionsOpen,
    error,
    toggleTransactions,
    fetchTransactionsIfNeeded,
  } = useWallet()

  // Redirect back to this page to clear stale MoMo/VNPay return URL in the address bar
  // (BE returns {json} as path segment instead of query params, leaving junk in the URL)
  const rawUrl = location.pathname + location.search
  const isStalePaymentRedirect = rawUrl.includes('partnerCode') ||
    rawUrl.includes('resultCode') || rawUrl.includes('MOMO')

  if (isStalePaymentRedirect) {
    navigate(walletBase, { replace: true })
    return null
  }

  const handleToggleTransactions = () => {
    toggleTransactions()
    fetchTransactionsIfNeeded()
  }

  const walletParentPath = walletBase.replace(/\/wallet\/?$/, "") || "/profile"

  return (
    <section className="home-anime min-h-[calc(100vh-64px)] bg-transparent px-3 py-8 md:px-4 md:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="overflow-hidden rounded-3xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[10px_10px_0_0_rgba(30,27,75,0.38)]">
          <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {VI.wallet.title}
            </h1>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => navigate(walletParentPath)}
            >
              {VI.common.actions.back}
            </Button>
          </div>

          {/* Error state */}
          {error && (
            <div className="mt-4 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loadingWallet && (
            <div className="mt-4 text-sm text-muted-foreground">
              {VI.wallet.loading}
            </div>
          )}

          {/* Wallet balance */}
          {walletInfo && !loadingWallet && (
            <>
              <div className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-card to-muted/40 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {VI.wallet.balance}
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                  {formatCurrency(walletInfo.balance)}
                </p>
              </div>

              {/* Deposit balance - only show if > 0 */}
              {walletInfo.depositBalance > 0 && (
                <div className="mt-3 rounded-2xl border border-cosmate-pink/25 bg-gradient-to-br from-cosmate-soft-pink/40 to-cosmate-lavender-surface/50 p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-cosmate-pink">
                    {VI.wallet.depositBalance}
                  </p>
                  <p className="mt-2 text-xl font-bold tabular-nums text-cosmate-pink sm:text-2xl">
                    {formatCurrency(walletInfo.depositBalance)}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Top-up / withdraw */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate(`${walletBase}/withdraw`)}
            >
              {VI.wallet.withdraw}
            </Button>
            <Button
              type="button"
              variant="soft"
              className="w-full rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[5px_5px_0_0_#1e1b4b] hover:brightness-105 sm:w-auto"
              onClick={() => navigate(`${walletBase}/topup`)}
            >
              {VI.wallet.topup}
            </Button>
          </div>

          <div className="my-8 h-px w-full bg-indigo-950/15" aria-hidden />

          {/* Transaction history — disclosure control */}
          <div>
            <button
              type="button"
              onClick={handleToggleTransactions}
              aria-expanded={isTransactionsOpen}
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-left shadow-sm transition-all duration-200",
                "hover:border-cosmate-pink/35 hover:bg-gradient-to-r hover:from-card hover:to-cosmate-soft-pink/30 hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cosmate-pink/25 bg-cosmate-soft-pink/45 text-cosmate-pink transition-colors group-hover:border-cosmate-pink/40 group-hover:bg-cosmate-soft-pink/70"
                aria-hidden
              >
                <History className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">
                  {isTransactionsOpen ? VI.wallet.hideTransactions : VI.wallet.viewTransactions}
                </span>
              </span>
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition-all duration-200",
                  "group-hover:border-cosmate-pink/30 group-hover:bg-cosmate-soft-pink/40 group-hover:text-cosmate-pink",
                  isTransactionsOpen && "border-cosmate-pink/35 bg-cosmate-soft-pink/50 text-cosmate-pink"
                )}
                aria-hidden
              >
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform duration-200", isTransactionsOpen && "rotate-180")}
                />
              </span>
            </button>

            {/* Collapsible transaction list */}
            {isTransactionsOpen && (
              <div className="mt-4 space-y-3 rounded-2xl border border-border/80 bg-muted/20 p-3 sm:p-4">
                {loadingTransactions ? (
                  <div className="rounded-xl border border-dashed border-border bg-card/60 px-4 py-8 text-center text-sm text-muted-foreground">
                    {VI.wallet.loading}
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-cosmate-pink/25 bg-cosmate-soft-pink/15 px-4 py-8 text-center text-sm text-muted-foreground">
                    {VI.wallet.noTransactions}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-3 shadow-sm transition-colors hover:border-cosmate-pink/20 sm:px-4"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {getTransactionTypeLabel(transaction.type)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {formatCurrency(transaction.amount)}
                          </p>
                          <span
                            className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {getStatusLabel(transaction.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
