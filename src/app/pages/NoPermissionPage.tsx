import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { ShieldX } from 'lucide-react';
import { VI } from '@/shared/i18n/vi';

/**
 * Global "No Permission" Page
 * 
 * Shown when user tries to access a route they don't have permission for
 * or when their provider type is not yet supported
 * 
 * TRIGGERED BY:
 * - ProtectedRoute component when role check fails
 * - Login redirect for unsupported provider types (PROVIDER_PHOTOGRAPH, PROVIDER_EVENT_STAFF)
 * - Manual navigation to /no-permission
 */
export default function NoPermissionPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f5f5',
      }}
    >
      <Result
        icon={<ShieldX size={64} color="#faad14" />}
        status="warning"
        title={VI.common.permission.accessDenied}
        subTitle={VI.common.permission.noPermissionMessage}
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            {VI.common.permission.goHome}
          </Button>,
          <Button key="login" onClick={() => navigate('/login')}>
            {VI.common.permission.goLogin}
          </Button>,
        ]}
      />
    </div>
  );
}
