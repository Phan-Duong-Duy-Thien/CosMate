import React, { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { Tooltip } from 'antd';
import { useUserProfile } from '@/app/providers/UserProfileProvider';

export function AITokenBadge() {
  const { userProfile } = useUserProfile();
  const [animate, setAnimate] = useState(false);
  const prevTokensRef = useRef(userProfile.numberOfToken);

  useEffect(() => {
    if (userProfile.numberOfToken !== undefined && prevTokensRef.current !== undefined) {
      if (userProfile.numberOfToken < prevTokensRef.current) {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 500);
        return () => clearTimeout(timer);
      }
    }
    prevTokensRef.current = userProfile.numberOfToken;
  }, [userProfile.numberOfToken]);

  const tokens = userProfile.numberOfToken ?? 0;

  return (
    <Tooltip title="Số dư AI Token">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
          color: '#78350F',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'default',
          boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)',
          transform: animate ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        <Sparkles size={16} fill="currentColor" />
        <span>{tokens}</span>
      </div>
    </Tooltip>
  );
}
