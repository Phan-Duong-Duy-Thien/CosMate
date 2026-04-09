/**
 * useResetPassword Hook
 *
 * Manages password reset: loading state, submission, and error handling.
 * Called by ResetPasswordPage only.
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { resetPassword } from '../api/auth.api';
import { VI } from '@/shared/i18n/vi';

interface UseResetPasswordResult {
  submitting: boolean;
  submit: (token: string, newPassword: string) => Promise<boolean>;
}

export function useResetPassword(): UseResetPasswordResult {
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async (token: string, newPassword: string): Promise<boolean> => {
    if (!token) {
      message.error(VI.auth.resetPassword.messages.invalidToken);
      return false;
    }
    if (!newPassword) {
      message.error(VI.auth.resetPassword.validation.passwordRequired);
      return false;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      return true;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || VI.auth.resetPassword.messages.resetError;
      message.error(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submitting, submit };
}
