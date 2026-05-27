import { VI } from '@/shared/i18n/vi';
import { AiTokenPlansManagementView } from '@/features/staff-token/components/AiTokenPlansManagementView';
import { useAdminAiTokenPlans } from '../hooks/useAdminAiTokenPlans';

export default function AdminAiTokenPlansPage() {
  const hook = useAdminAiTokenPlans();
  return (
    <AiTokenPlansManagementView
      {...hook}
      texts={VI.admin.aiTokenPlans}
      rowClassName="admin-ai-token-plan-row"
    />
  );
}
