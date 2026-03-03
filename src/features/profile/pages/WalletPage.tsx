import { useNavigate } from "react-router-dom"
import { Card } from "@/shared/components/Card"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"
import { useWallet } from "../hooks/useWallet"

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
  if (normalizedStatus === "COMPLETED") return "text-green-600 bg-green-50"
  if (normalizedStatus === "FAILED") return "text-red-600 bg-red-50"
  if (normalizedStatus === "PENDING") return "text-yellow-600 bg-yellow-50"
  return "text-slate-600 bg-slate-50"
}

// Get status label
function getStatusLabel(status: string): string {
  const normalizedStatus = status?.toUpperCase()
  if (normalizedStatus === "COMPLETED") return VI.profile.wallet.statusCompleted
  if (normalizedStatus === "FAILED") return VI.profile.wallet.statusFailed
  if (normalizedStatus === "PENDING") return VI.profile.wallet.statusPending
  return status
}

// Get transaction type label
function getTransactionTypeLabel(type: string): string {
  const normalizedType = type?.toUpperCase()

  // CREDIT = Nap tien vao vi
  if (normalizedType === "CREDIT") return VI.profile.wallet.typeTopUp

  // ORDER#xxx = Thanh toan don thue
  if (normalizedType?.startsWith("ORDER")) return VI.profile.wallet.typePayment

  // REFUND = Hoan tien
  if (normalizedType === "REFUND") return VI.profile.wallet.typeRefund

  // DEPOSIT = Dat coc
  if (normalizedType === "DEPOSIT") return VI.profile.wallet.typeDeposit

  return VI.profile.wallet.typeOther
}

export default function WalletPage() {
  const navigate = useNavigate()
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

  const handleToggleTransactions = () => {
    toggleTransactions()
    fetchTransactionsIfNeeded()
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#fff6fc] via-[#f6f5ff] to-[#eef7ff] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-slate-900">{VI.profile.wallet.title}</h1>

          {/* Error state */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loadingWallet && (
            <div className="mt-4 text-sm text-slate-500">
              {VI.profile.wallet.loading}
            </div>
          )}

          {/* Wallet balance */}
          {walletInfo && !loadingWallet && (
            <>
              <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-500">{VI.profile.wallet.balance}</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {formatCurrency(walletInfo.balance)}
                </p>
              </div>

              {/* Deposit balance - only show if > 0 */}
              {walletInfo.depositBalance > 0 && (
                <div className="mt-3 rounded-xl bg-blue-50 px-4 py-3">
                  <p className="text-xs font-medium text-blue-600">{VI.profile.wallet.depositBalance}</p>
                  <p className="mt-1 text-xl font-semibold text-blue-700">
                    {formatCurrency(walletInfo.depositBalance)}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Top-up button */}
          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={() => navigate("/profile/wallet/topup")}>
              {VI.profile.wallet.topup}
            </Button>
          </div>

          {/* Transaction history section */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleToggleTransactions}
              className="flex w-full items-center justify-between text-left font-medium text-slate-700 hover:text-slate-900"
            >
              <span>
                {isTransactionsOpen ? VI.profile.wallet.hideTransactions : VI.profile.wallet.viewTransactions}
              </span>
              <span className="text-lg">{isTransactionsOpen ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible transaction list */}
            {isTransactionsOpen && (
              <div className="mt-4">
                {loadingTransactions ? (
                  <div className="text-sm text-slate-500">{VI.profile.wallet.loading}</div>
                ) : transactions.length === 0 ? (
                  <div className="text-sm text-slate-500">{VI.profile.wallet.noTransactions}</div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            {getTransactionTypeLabel(transaction.type)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">
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
        </Card>
      </div>
    </section>
  )
}
