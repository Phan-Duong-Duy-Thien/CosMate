/**
 * Header badge showing current provider plan name (Ant Design Tag).
 */
import { Spin, Tag } from 'antd';
import { CrownOutlined } from '@ant-design/icons';
import { useProviderSubscriptionInfo } from '../hooks/useProviderSubscriptionInfo';
import { VI } from '@/shared/i18n/vi';

export function ProviderSubscriptionBadge() {
  const { info, loading, error } = useProviderSubscriptionInfo();

  if (loading) {
    return (
      <div className="hidden min-w-[80px] items-center justify-center sm:flex">
        <Spin size="small" />
      </div>
    );
  }

  if (error || !info?.currentPlanName?.trim()) {
    return null;
  }

  const planName = info.currentPlanName.trim();
  const tooltip = `${VI.provider.subscription.headerBadgeTitle}: ${planName} · ${info.currentDaysRemaining} ${VI.provider.subscription.daysSuffix}`;

  return (
    <Tag
      color="purple"
      icon={<CrownOutlined />}
      className="!hidden !max-w-[200px] !truncate sm:!inline-flex"
      title={tooltip}
    >
      {planName}
    </Tag>
  );
}
