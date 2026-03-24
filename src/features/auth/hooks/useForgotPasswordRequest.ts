/**
 * useForgotPasswordRequest Hook
 *
 * Manages forgot password request: loading state, submission, and error handling.
 * Called by ForgotPasswordPage only.
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { requestPasswordReset } from '../api/auth.api';
import { VI } from '@/shared/i18n/vi';

interface UseForgotPasswordRequestResult {
  submitting: boolean;
  submit: (identifier: string) => Promise<boolean>;
}

export function useForgotPasswordRequest(): UseForgotPasswordRequestResult {
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async (identifier: string): Promise<boolean> => {
    if (!identifier.trim()) {
      message.error(VI.auth.forgotPassword.validation.identifierRequired);
      return false;
    }

    setSubmitting(true);
    try {
      await requestPasswordReset(identifier.trim());
      return true;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || VI.auth.forgotPassword.messages.sendError;
      message.error(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submitting, submit };
}
