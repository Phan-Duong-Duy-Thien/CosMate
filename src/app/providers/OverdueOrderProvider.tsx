/**
 * Overdue Order Provider
 *
 * Global context that checks whether the current cosplayer has any
 * orders with status OVERDUE. When at least one OVERDUE order exists,
 * the app locks most functionality — see OverdueLockGuard.
 *
 * The provider automatically refreshes when:
 *   - ORDERS_CHANGED data-sync event fires (after return order, etc.)
 *   - auth:changed fires (after login/logout)
 */

import * as React from "react"
import { getUserId, getRoles } from "@/features/auth/services/tokenStorage"
import { isAuthenticated } from "@/features/auth/utils/authStorage"
import { getAllOrdersByUserId } from "@/features/order/api/order.api"
import { subscribeDataSync, DATA_SYNC_EVENTS } from "@/shared/sync/dataSync"
import type { OrderItem } from "@/features/order/types"
import { Modal, Button } from "antd"
import { useNavigate } from "react-router-dom"

// ─── Context shape ──────────────────────────────────────────────────────────

interface OverdueOrderContextValue {
  /** true when the user has ≥1 order with status OVERDUE */
  isLocked: boolean
  /** The list of OVERDUE orders (empty when not locked) */
  overdueOrders: OrderItem[]
  /** Whether the provider is currently loading order data */
  loading: boolean
  /** Force a refresh (e.g. after returning an order) */
  refresh: () => void
}

const OverdueOrderContext = React.createContext<OverdueOrderContextValue>({
  isLocked: false,
  overdueOrders: [],
  loading: false,
  refresh: () => {},
})

// ─── Provider ───────────────────────────────────────────────────────────────

// ⚡ DEBUG: Gõ trong browser console để test màn hình khóa:
//   Bật và giữ sau khi reload:  localStorage.setItem('debug_overdue', 'true')
//   Tắt:                      localStorage.removeItem('debug_overdue')
//   (Sau đó reload lại trang để áp dụng)
//
//   Hoặc bật tạm thời (mất khi reload): window.__COSMATE_DEBUG_OVERDUE = true
//   (sau đó gõ: window.dispatchEvent(new Event('cosmate:orders-changed')))
// ⚠️ XÓA BLOCK NÀY TRƯỚC KHI DEPLOY PRODUCTION

// ⚡ DEBUG UPCOMING: Gõ trong browser console để test thông báo sắp tới hạn:
//   Bật:  localStorage.setItem('debug_upcoming', 'true')
//   Tắt:  localStorage.removeItem('debug_upcoming')

declare global {
  interface Window {
    __COSMATE_DEBUG_OVERDUE?: boolean
  }
}

const FAKE_OVERDUE_ORDERS: OrderItem[] = [
  {
    id: 9999,
    orderType: "RENT_COSTUME",
    status: "OVERDUE",
    totalAmount: 350000,
    depositAmount: 100000,
    rentDay: 3,
    rentStart: "2026-05-28",
    rentEnd: "2026-05-31",
    costumeId: 1,
    costumeName: "[DEBUG] Trang phục Cosplay Test",
    costumeImage: "",
    cosplayerId: 0,
    cosplayerName: "Debug User",
    createdAt: "2026-05-28T00:00:00",
    updatedAt: "2026-05-28T00:00:00",
  },
]

const FAKE_UPCOMING_ORDERS: OrderItem[] = [
  {
    id: 8888,
    orderType: "RENT_COSTUME",
    status: "IN_USE",
    totalAmount: 250000,
    depositAmount: 100000,
    rentDay: 2,
    rentStart: "2026-06-01",
    rentEnd: "2026-06-07",
    costumeId: 2,
    costumeName: "[DEBUG] Đơn hàng sắp tới hạn Test",
    costumeImage: "",
    cosplayerId: 0,
    cosplayerName: "Debug User",
    createdAt: "2026-06-01T00:00:00",
    updatedAt: "2026-06-01T00:00:00",
  },
]

export function OverdueOrderProvider({ children }: { children: React.ReactNode }) {
  const [overdueOrders, setOverdueOrders] = React.useState<OrderItem[]>([])
  const [loading, setLoading] = React.useState(false)
  
  // Upcoming warning state
  const [showUpcomingModal, setShowUpcomingModal] = React.useState(false)
  const [upcomingCount, setUpcomingCount] = React.useState(0)
  const navigate = useNavigate()

  const fetchOverdue = React.useCallback(async () => {
    // ⚡ DEBUG: force lock via console or localStorage
    const isDebugForced = window.__COSMATE_DEBUG_OVERDUE ?? (localStorage.getItem("debug_overdue") === "true")
    if (isDebugForced) {
      console.warn("[OverdueOrderProvider] 🔒 DEBUG MODE — forced OVERDUE lock")
      setOverdueOrders(FAKE_OVERDUE_ORDERS)
      return
    }

    // Only check for logged-in cosplayers
    if (!isAuthenticated()) {
      setOverdueOrders([])
      return
    }

    const roles = getRoles()
    const normalizedRoles = roles.map((r) => {
      const s = String(r).toUpperCase()
      if (s === "3") return "COSPLAYER"
      return s
    })

    if (!normalizedRoles.includes("COSPLAYER")) {
      setOverdueOrders([])
      return
    }

    const userId = getUserId()
    if (!userId) {
      setOverdueOrders([])
      return
    }

    try {
      setLoading(true)
      const orders = await getAllOrdersByUserId(userId)
      
      // Check overdue
      const overdue = orders.filter((o) => o.status === "OVERDUE")
      setOverdueOrders(overdue)

      // Check upcoming (due tomorrow, i.e. exactly 1 day remaining)
      const isUpcomingDebug = localStorage.getItem("debug_upcoming") === "true"
      const upcoming = isUpcomingDebug
        ? FAKE_UPCOMING_ORDERS
        : orders.filter((o) => {
            if (o.status !== "IN_USE") return false
            if (!o.rentEnd) return false
            const end = new Date(o.rentEnd)
            if (isNaN(end.getTime())) return false

            const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())
            const today = new Date()
            const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

            const dayDiff = Math.round((endDay.getTime() - todayDay.getTime()) / (1000 * 60 * 60 * 24))
            return dayDiff === 1
          })

      if (overdue.length === 0 && upcoming.length > 0) {
        setUpcomingCount(upcoming.length)
        const hasShown = sessionStorage.getItem("cosmate_shown_upcoming_warning")
        if (!hasShown || isUpcomingDebug) {
          setShowUpcomingModal(true)
          sessionStorage.setItem("cosmate_shown_upcoming_warning", "true")
        }
      }
    } catch (err) {
      console.error("[OverdueOrderProvider] Failed to check overdue orders:", err)
      // Don't lock on error — fail open
      setOverdueOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch on mount
  React.useEffect(() => {
    void fetchOverdue()
  }, [fetchOverdue])

  // Re-check when orders change (e.g. after successful return)
  React.useEffect(() => {
    return subscribeDataSync(DATA_SYNC_EVENTS.ORDERS_CHANGED, () => {
      void fetchOverdue()
    })
  }, [fetchOverdue])

  // Re-check on auth change (login/logout)
  React.useEffect(() => {
    const handler = () => void fetchOverdue()
    window.addEventListener("auth:changed", handler)
    return () => window.removeEventListener("auth:changed", handler)
  }, [fetchOverdue])

  const value = React.useMemo<OverdueOrderContextValue>(
    () => ({
      isLocked: overdueOrders.length > 0,
      overdueOrders,
      loading,
      refresh: fetchOverdue,
    }),
    [overdueOrders, loading, fetchOverdue],
  )

  return (
    <OverdueOrderContext.Provider value={value}>
      {children}
      <Modal
        open={showUpcomingModal}
        onCancel={() => setShowUpcomingModal(false)}
        footer={null}
        centered
        closable={false}
        width={450}
        classNames={{
          content: "!border-[4px] !border-[#1e1b4b] !rounded-[24px] !shadow-[8px_8px_0_0_#1e1b4b] !bg-[#fffbeb] !p-[28px]",
        }}
      >
        <div className="flex flex-col items-center text-center space-y-5">
          {/* Circular Alert Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-[4px_4px_0_0_#1e1b4b] text-white">
            <span className="text-3xl">⚠️</span>
          </div>

          {/* Heading */}
          <h2 className="text-xl font-black text-indigo-950 tracking-tight">
            Nhắc Nhở Hạn Trả Đồ
          </h2>

          {/* Body Content */}
          <p className="text-sm font-semibold leading-relaxed text-indigo-900/80 px-2">
            Bạn đang có <span className="font-black text-pink-600 text-lg">{upcomingCount}</span> đơn thuê sắp tới hạn (còn 1 ngày). Vui lòng kiểm tra và tiến hành gia hạn hoặc chuẩn bị hoàn trả đồ đúng hẹn nhé!
          </p>

          {/* Action Buttons */}
          <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
            <button
              onClick={() => setShowUpcomingModal(false)}
              className="flex-1 rounded-xl border-[3px] border-indigo-950 bg-white py-2.5 text-sm font-black text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] transition hover:bg-slate-50 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#1e1b4b]"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                setShowUpcomingModal(false)
                navigate("/profile/purchase-history?tab=in_use")
              }}
              className="flex-1 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 py-2.5 text-sm font-black text-white shadow-[4px_4px_0_0_#1e1b4b] transition hover:brightness-105 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#1e1b4b]"
            >
              Xem danh sách đơn
            </button>
          </div>
        </div>
      </Modal>
    </OverdueOrderContext.Provider>
  )
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useOverdueOrderLock(): OverdueOrderContextValue {
  return React.useContext(OverdueOrderContext)
}
