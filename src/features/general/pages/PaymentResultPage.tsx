/**
 * Payment Result Page
 * Displays payment result after redirect from payment gateway.
 *
 * Single source of truth: BE API (via usePaymentVerification).
 * URL params are only a shortcut hint — the hook fetches the real order
 * status to determine the final UI state.
 *
 * Priority:
 *  1. resultCode param  → MoMo external redirect (resultCode=0 → success, else → use BE)
 *  2. status param     → WALLET or BE internal redirect (use BE as final truth)
 *  3. No params / unknown → use BE as final truth if orderId is real
 *
 * Anti-replay guard: each orderId is marked in sessionStorage to prevent
 * duplicate processing on re-mount or back-button scenarios.
 */
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { VI } from '@/shared/i18n/vi';
import { getRoles } from '@/features/auth/services/tokenStorage';
import { getRedirectPath } from '@/features/auth/utils/roleRedirect';
import { usePaymentVerification } from '@/features/order/hooks/usePaymentVerification';
import type { UserRole } from '@/types/auth';

type PaymentStatus = 'success' | 'failed' | 'cancelled' | 'unknown';

function parseUrlHint(): { status: PaymentStatus; orderId: string | null; message: string | null } {
  const params = new URLSearchParams(window.location.search);

  const orderId = params.get('orderId') || params.get('transactionId') || null;
  const message = params.get('message') || null;

  // MoMo / external gateway: resultCode present
  const rawResultCode = params.get('resultCode');
  if (rawResultCode !== null) {
    if (rawResultCode === '0') return { status: 'success', orderId, message };
    if (rawResultCode === '1006' || rawResultCode === '1009') return { status: 'cancelled', orderId, message };
    // resultCode present but not success/cancelled → treat as hint only; use BE as truth
  }

  // Internal BE redirect: status param present
  const rawStatus = params.get('status');
  if (rawStatus !== null) {
    const valid = (['success', 'failed', 'cancelled'].includes(rawStatus)
      ? rawStatus
      : 'unknown') as PaymentStatus;
    return { status: valid, orderId, message };
  }

  return { status: 'unknown', orderId, message };
}

export default function PaymentResultPage() {
  const navigate = useNavigate();

  const { status: urlStatus, orderId: rawOrderId } = parseUrlHint();

  // Authoritative status from BE API — overrides URL hint for WALLET / BE redirects
  const { status: verifiedStatus, isLoading, error } = usePaymentVerification(rawOrderId);

  // Final status: use verified BE status when available, fall back to URL hint
  const status: PaymentStatus = verifiedStatus !== 'unknown' ? verifiedStatus : urlStatus;
  const isSuccess = status === 'success';

  // Anti-replay guard
  React.useEffect(() => {
    if (rawOrderId) {
      const key = `cosmate:payment:processed:${rawOrderId}`;
      if (sessionStorage.getItem(key) === '1') return;
      sessionStorage.setItem(key, '1');
    }
  }, [rawOrderId]);

  const getTitle = () => {
    switch (status) {
      case 'success':   return VI.paymentResult.successTitle;
      case 'failed':    return VI.paymentResult.failedTitle;
      case 'cancelled': return VI.paymentResult.cancelledTitle;
      default:          return VI.paymentResult.unknownTitle;
    }
  };

  const getDescription = () => {
    if (isLoading) return 'Verifying payment status...';
    if (error) return error;
    switch (status) {
      case 'success':   return VI.paymentResult.successDesc;
      case 'failed':    return VI.paymentResult.failedDesc;
      case 'cancelled': return VI.paymentResult.cancelledDesc;
      default:          return VI.paymentResult.unknownDesc;
    }
  };

  const handlePrimaryAction = () => {
    navigate('/profile/wallet');
  };

  const getHomeRedirectPath = () => {
    const roles = getRoles() as UserRole[];
    return getRedirectPath(roles);
  };

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
      <div className="mx-auto flex max-w-lg items-center justify-center px-4 pt-16">
        <div className="w-full rounded-3xl border border-white/80 bg-white/80 p-8 shadow-xl text-center">
          <div className="mb-6 flex justify-center">
            {isLoading ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <svg className="h-10 w-10 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : isSuccess ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          <h1 className="text-2xl font-semibold text-slate-900">{getTitle()}</h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">{getDescription()}</p>

          {rawOrderId && rawOrderId !== 'unknown' && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">{VI.paymentResult.orderIdLabel}</p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-900">{rawOrderId}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Button variant="default" size="lg" className="w-full rounded-full" onClick={handlePrimaryAction}>
              {isSuccess ? VI.paymentResult.primarySuccessCta : VI.paymentResult.primaryFailedCta}
            </Button>
            <Link to={getHomeRedirectPath()}>
              <Button variant="outline" size="lg" className="w-full rounded-full">
                {VI.paymentResult.homeCta}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
