/**
 * Overdue Lock Guard
 *
 * Route-level guard that intercepts navigation when the cosplayer
 * has overdue orders. Whitelisted paths are allowed through;
 * everything else shows the OverdueLockScreen overlay.
 */

import { Outlet, useLocation } from "react-router-dom"
import { useOverdueOrderLock } from "@/app/providers/OverdueOrderProvider"
import OverdueLockScreen from "@/app/components/OverdueLockScreen"

/** Paths that remain accessible even when the account is locked. */
const WHITELISTED_PATHS = [
  "/profile/purchase-history",
  "/profile",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/payment/result",
  "/no-permission",
]

function isWhitelisted(pathname: string): boolean {
  return WHITELISTED_PATHS.some((allowed) => {
    // Exact match or starts-with for nested paths like /register/cosplayer
    return pathname === allowed || pathname.startsWith(allowed + "/")
  })
}

export function OverdueLockGuard() {
  const { isLocked, loading } = useOverdueOrderLock()
  const location = useLocation()

  // Don't block while still loading — fail open
  if (loading) return <Outlet />

  // Not locked → pass through
  if (!isLocked) return <Outlet />

  // Locked but on a whitelisted path → pass through
  if (isWhitelisted(location.pathname)) return <Outlet />

  // Locked + not whitelisted → show lock screen
  return (
    <>
      <Outlet />
      <OverdueLockScreen />
    </>
  )
}
