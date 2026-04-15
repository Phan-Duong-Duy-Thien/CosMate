/**
 * Photograph Provider Wallet Layout
 * Wraps existing wallet pages inside DashboardLayout for PROVIDER_PHOTOGRAPH role.
 * Reuses all existing wallet logic from src/features/profile/.
 */
import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { photographSidebarItems } from "../constants/sidebar";
import type { DashboardSidebarItem } from "@/app/layouts/DashboardLayout";

export function ProviderPhotographWalletLayout() {
  const sidebarItems: DashboardSidebarItem[] = photographSidebarItems.map((item) => {
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
