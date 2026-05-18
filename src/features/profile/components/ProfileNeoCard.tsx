import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/shared/components/Card';
import { cn } from '@/lib/utils';
import { PROFILE_CARD_UI } from '../constants/profileUi';

interface ProfileNeoCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function ProfileNeoCard({
  title,
  icon: Icon,
  children,
  footer,
  className,
  hoverable = true,
}: ProfileNeoCardProps) {
  return (
    <Card className={cn(PROFILE_CARD_UI.card, hoverable && PROFILE_CARD_UI.cardHover, className)}>
      <div className={PROFILE_CARD_UI.inner}>
        <div className="flex items-start justify-between gap-3">
          <h2 className={PROFILE_CARD_UI.title}>{title}</h2>
          <div className={PROFILE_CARD_UI.iconBox} aria-hidden>
            <Icon className={PROFILE_CARD_UI.iconGlyph} />
          </div>
        </div>
        <div className={PROFILE_CARD_UI.body}>{children}</div>
        {footer ? <div className={PROFILE_CARD_UI.footer}>{footer}</div> : null}
      </div>
    </Card>
  );
}

interface ProfileMetricBodyProps {
  label: string;
  value: ReactNode;
}

export function ProfileMetricBody({ label, value }: ProfileMetricBodyProps) {
  return (
    <>
      <p className={PROFILE_CARD_UI.label}>{label}</p>
      <p className={PROFILE_CARD_UI.value}>{value}</p>
    </>
  );
}
