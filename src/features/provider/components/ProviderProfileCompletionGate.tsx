/**
 * ProviderProfileCompletionGate
 * Presentational blocking screen shown when provider is verified but profile is incomplete.
 * No API calls — receives data and callbacks via props.
 */
import { Card, Button, Typography, Steps } from 'antd';
import { UserOutlined, BankOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { VI } from '@/shared/i18n/vi';

const { Title, Paragraph } = Typography;

interface ProviderProfileCompletionGateProps {
  onComplete: () => void;
}

export function ProviderProfileCompletionGate({
  onComplete,
}: ProviderProfileCompletionGateProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <Card
        style={{
          maxWidth: 640,
          width: '100%',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: "var(--cosmate-lavender-surface)",
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <CheckCircleOutlined style={{ fontSize: 28, color: "var(--primary)" }} />
          </div>
          <Title level={3} style={{ marginBottom: 8 }}>
            {VI.provider.profileCompletion.title}
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {VI.provider.profileCompletion.subtitle}
          </Paragraph>
        </div>

        {/* Steps overview */}
        <div style={{ marginBottom: 24 }}>
          <Steps
            current={-1}
            items={[
              {
                title: VI.provider.profileCompletion.step1Title,
                icon: <UserOutlined />,
              },
              {
                title: VI.provider.profileCompletion.step2Title,
                icon: <BankOutlined />,
              },
            ]}
          />
        </div>

        {/* What is needed */}
        <div style={{ marginBottom: 24 }}>
          <Paragraph strong style={{ marginBottom: 8 }}>
            {VI.provider.profileCompletion.requirementsLabel}
          </Paragraph>
          <ul className="m-0 pl-5 text-sm text-cosmate-mauve">
            <li>{VI.provider.profileCompletion.reqShopName}</li>
            <li>{VI.provider.profileCompletion.reqAddress}</li>
            <li>{VI.provider.profileCompletion.reqBio}</li>
            <li>{VI.provider.profileCompletion.reqBank}</li>
          </ul>
        </div>

        {/* CTA */}
        <Button
          type="primary"
          size="large"
          block
          onClick={onComplete}
          style={{ borderRadius: 8, height: 48, fontSize: 16 }}
        >
          {VI.provider.profileCompletion.cta}
        </Button>
      </Card>
    </div>
  );
}
