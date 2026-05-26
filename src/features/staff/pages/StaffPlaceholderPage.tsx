import { Card } from '@/shared/components/Card';
import { VI } from '@/shared/i18n/vi';
import { Construction } from 'lucide-react';

type StaffPlaceholderPageProps = {
  title: string;
};

export default function StaffPlaceholderPage({ title }: StaffPlaceholderPageProps) {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50">
          <Construction className="h-7 w-7 text-pink-500" aria-hidden />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{VI.staff.comingSoon.message}</p>
      </Card>
    </div>
  );
}
