/**
 * Payment Result Page
 * Displays payment result after redirect from payment gateway.
 *
 * Handles BOTH costume orders (via usePaymentVerification → /api/orders/{id})
 * and service orders (via useServiceOrderVerification → GET /api/service-orders/cosplayer/{userId}).
 *
 * Status priority: service verification → costume verification → URL hint.
 * Only uses EXISTING BE APIs — no invented endpoints.
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
import { useServiceOrderVerification } from '@/features/service/hooks/useServiceOrderVerification';
import type { UserRole } from '@/types/auth';
import { MessageCircle } from 'lucide-react';

type PaymentStatus = 'success' | 'failed' | 'cancelled' | 'pending' | 'unknown';

/**
 * Determines the payment status hint from URL params.
 * resultCode is MoMo/VNPay callback; status is BE internal redirect.
 */
function parseUrlHint(): { status: PaymentStatus; orderId: string | null; message: string | null } {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId') || params.get('transactionId') || null;
  const message = params.get('message') || null;

  const rawResultCode = params.get('resultCode');
  if (rawResultCode !== null) {
    if (rawResultCode === '0') return { status: 'success', orderId, message };
    if (rawResultCode === '1006' || rawResultCode === '1009') return { status: 'cancelled', orderId, message };
  }

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

  // Authoritative status for costume orders (orderType = RENT_COSTUME)
  const costumeVerification = usePaymentVerification(rawOrderId);
  // Authoritative status for service orders (orderType = RENT_SERVICE)
  const serviceVerification = useServiceOrderVerification(rawOrderId);

  // Use whichever verification has returned a definitive result (not 'unknown')
  const costumeResolved = costumeVerification.status !== 'unknown';
  const serviceResolved = serviceVerification.status !== 'unknown';

  let finalStatus: PaymentStatus;
  if (serviceResolved) {
    finalStatus = serviceVerification.status;
  } else if (costumeResolved) {
    finalStatus = costumeVerification.status;
  } else {
    finalStatus = urlStatus;
  }

  const isLoading = !costumeResolved && !serviceResolved;
  const isSuccess = finalStatus === 'success';
  const error = (serviceVerification.error || costumeVerification.error) ?? null;

  React.useEffect(() => {
    console.log('[FINAL STATUS]', finalStatus);
  }, [finalStatus]);

  // Anti-replay guard
  React.useEffect(() => {
    if (rawOrderId) {
      const key = `cosmate:payment:processed:${rawOrderId}`;
      if (sessionStorage.getItem(key) === '1') return;
      sessionStorage.setItem(key, '1');
    }
  }, [rawOrderId]);

  const getTitle = () => {
    switch (finalStatus) {
      case 'success':   return VI.paymentResult.successTitle;
      case 'failed':    return VI.paymentResult.failedTitle;
      case 'cancelled': return VI.paymentResult.cancelledTitle;
      case 'pending':   return VI.paymentResult.pendingTitle ?? VI.paymentResult.unknownTitle;
      default:          return VI.paymentResult.unknownTitle;
    }
  };

  const getDescription = () => {
    if (isLoading) return 'Verifying payment status...';
    if (error) return error;
    switch (finalStatus) {
      case 'success':   return VI.paymentResult.successDesc;
      case 'failed':    return VI.paymentResult.failedDesc;
      case 'cancelled': return VI.paymentResult.cancelledDesc;
      case 'pending':   return VI.paymentResult.pendingDesc ?? 'Thanh toán đang được xử lý. Vui lòng chờ.';
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
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
                <MessageCircle className="h-10 w-10 text-pink-500" />
              </div>
            ) : finalStatus === 'pending' ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                <svg className="h-10 w-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
