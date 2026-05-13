import { EyeOutlined } from '@ant-design/icons';
import { forwardRef, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/**
 * Icon “xem chi tiết” trong bảng admin — Ant Design + màu token trên `style`
 * (ổn định trong Table; tránh Lucide/`currentColor` trong ô Ant Table).
 */
export const AdminDetailEyeIcon = forwardRef<HTMLSpanElement, ComponentProps<typeof EyeOutlined>>(
  function AdminDetailEyeIcon({ className, style, ...props }, ref) {
    return (
      <EyeOutlined
        ref={ref}
        {...props}
        className={cn('cosmate-admin-action-icon-view', className)}
        style={{ color: 'var(--cosmate-pink)', fontSize: 16, ...style }}
      />
    );
  }
);
