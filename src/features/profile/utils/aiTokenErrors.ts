import axios from 'axios';

import { VI } from '@/shared/i18n/vi';

import { AI_TOKEN_INSUFFICIENT_CODE } from '../constants/aiTokenCosts';

type ApiErrorBody = {
  code?: number;
  message?: string;
};

export const AI_UNAUTHORIZED_CODE = 1015;

export function isAiTokenInsufficientError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const data = error.response?.data as ApiErrorBody | undefined;
  return error.response?.status === 400 && data?.code === AI_TOKEN_INSUFFICIENT_CODE;
}

export function getAiTokenInsufficientMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined;
    if (data?.message?.trim()) return data.message.trim();
  }
  return VI.profile.token.insufficient;
}

export function isUnauthorizedAiError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const data = error.response?.data as ApiErrorBody | undefined;
  return (
    error.response?.status === 401 ||
    data?.code === AI_UNAUTHORIZED_CODE
  );
}

/** Shared mapper for AI feature catch blocks */
export function mapAiFeatureError(error: unknown, fallback: string): string {
  if (isAiTokenInsufficientError(error)) {
    return getAiTokenInsufficientMessage(error);
  }
  if (isUnauthorizedAiError(error)) {
    return VI.common.permission.goLogin;
  }
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined;
    if (data?.message?.trim()) return data.message.trim();
  }
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}
