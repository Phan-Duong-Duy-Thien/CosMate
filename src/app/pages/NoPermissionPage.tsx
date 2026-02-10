import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { ShieldX } from 'lucide-react';

/**
 * Global "No Permission" Page
 * 
 * Shown when user tries to access a route they don't have permission for
 * 
 * TRIGGERED BY:
 * - ProtectedRoute component when role check fails
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
        title="Access Denied"
        subTitle="You don't have permission to access this page. Please contact your administrator if you believe this is an error."
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            Go to Home
          </Button>,
          <Button key="login" onClick={() => navigate('/login')}>
            Go to Login
          </Button>,
        ]}
      />
    </div>
  );
}
