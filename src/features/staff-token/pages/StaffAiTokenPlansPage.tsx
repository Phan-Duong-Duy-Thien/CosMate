import { VI } from '@/shared/i18n/vi';
import { AiTokenPlansManagementView } from '../components/AiTokenPlansManagementView';
import { useStaffAiTokenPlans } from '../hooks/useStaffAiTokenPlans';

export default function StaffAiTokenPlansPage() {
  const hook = useStaffAiTokenPlans();
  return <AiTokenPlansManagementView {...hook} texts={VI.staff.tokenPlans} />;
}
