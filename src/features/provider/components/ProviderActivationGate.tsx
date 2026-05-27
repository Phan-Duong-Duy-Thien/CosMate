/**
 * ProviderActivationGate
 * Presentational blocking screen shown when provider.verified === false.
 */
import { Card, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { VI } from '@/shared/i18n/vi';
import { ProviderSubscribePlanForm } from './ProviderSubscribePlanForm';
import type { ProviderSubscribePlanFormProps } from './ProviderSubscribePlanForm';

const { Title, Paragraph } = Typography;

type ProviderActivationGateProps = Omit<
  ProviderSubscribePlanFormProps,
  'submitLabel' | 'submittingLabel'
>;

export function ProviderActivationGate(props: ProviderActivationGateProps) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-6">
      <Card
        style={{ maxWidth: 640, width: '100%', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'color-mix(in oklch, var(--cosmate-warning) 22%, var(--background))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <LockOutlined style={{ fontSize: 28, color: 'var(--cosmate-warning)' }} />
          </div>
          <Title level={3} style={{ marginBottom: 8 }}>
            {VI.provider.activation.title}
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {VI.provider.activation.subtitle}
          </Paragraph>
        </div>

        <ProviderSubscribePlanForm {...props} />
      </Card>
    </div>
  );
}
