/**
 * Event Staff Provider Wallet Layout
 * Wraps existing wallet pages inside DashboardLayout for PROVIDER_EVENT_STAFF role.
 * Reuses all existing wallet logic from src/features/profile/.
 */
import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { eventStaffSidebarItems } from "../constants/sidebar";
import type { DashboardSidebarItem } from "@/app/layouts/DashboardLayout";

export function ProviderEventStaffWalletLayout() {
  const sidebarItems: DashboardSidebarItem[] = eventStaffSidebarItems.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    };
  });

  return (
    <DashboardLayout
      title="My Wallet"
      sidebarItems={sidebarItems}
      brandName="CosMate"
      brandShort="CM"
      showChatButton={true}
    >
      <Outlet />
    </DashboardLayout>
  );
}
