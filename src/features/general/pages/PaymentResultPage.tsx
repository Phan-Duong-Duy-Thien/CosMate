/**
 * Payment Result Page
 * Displays payment result after redirect from payment gateway.
 *
 * Handles costume orders, service orders, and AI token purchases (context=token).
 */
import * as React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { VI } from '@/shared/i18n/vi';
import { getRoles } from '@/features/auth/services/tokenStorage';
import { getRedirectPath } from '@/features/auth/utils/roleRedirect';
import { getTokenHubPathForCurrentUser } from '@/features/profile/utils/tokenRoutes';
import { usePaymentVerification } from '@/features/order/hooks/usePaymentVerification';
import { useServiceOrderVerification } from '@/features/service/hooks/useServiceOrderVerification';
import type { UserRole } from '@/types/auth';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

type PaymentStatus = 'success' | 'failed' | 'cancelled' | 'pending' | 'unknown';

/**
 * Determines the payment status hint from URL params.
 * resultCode is MoMo/VNPay callback; status is BE internal redirect.
 */
function parseUrlHint(): { status: PaymentStatus; orderId: string | null; message: string | null } {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId') || params.get('transactionId') || params.get('purchaseId') || null;
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
  const [searchParams] = useSearchParams();
  const isTokenContext = searchParams.get('context') === 'token';
  const { status: urlStatus, orderId: rawOrderId } = parseUrlHint();
  const redirectUrl = searchParams.get('redirect') || null;

  const verifyOrderId = isTokenContext ? null : rawOrderId;

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('partnerCode') || params.has('vnp_TmnCode')) {
      console.error(
        '[PaymentResultPage] Payment gateway returned directly to FE.',
        'URL:',
        window.location.href
      );
    }
  }, []);

  const costumeVerification = usePaymentVerification(verifyOrderId);
  const serviceVerification = useServiceOrderVerification(verifyOrderId);

  const costumeResolved = costumeVerification.status !== 'unknown';
  const serviceResolved = serviceVerification.status !== 'unknown';

  let finalStatus: PaymentStatus;
  if (isTokenContext) {
    finalStatus = urlStatus;
  } else if (serviceResolved) {
    finalStatus = serviceVerification.status;
  } else if (costumeResolved) {
    finalStatus = costumeVerification.status;
  } else {
    finalStatus = urlStatus;
  }

  const isLoading =
    !isTokenContext &&
    (costumeVerification.isLoading || serviceVerification.isLoading);
  const isSuccess = finalStatus === 'success';
  const error = (serviceVerification.error || costumeVerification.error) ?? null;

  React.useEffect(() => {
    if (rawOrderId) {
      const key = `cosmate:payment:processed:${rawOrderId}`;
      if (sessionStorage.getItem(key) === '1') return;
      sessionStorage.setItem(key, '1');
    }
  }, [rawOrderId]);

  const getTitle = () => {
    if (isTokenContext && finalStatus === 'success') {
      return VI.paymentResult.tokenSuccessTitle;
    }
    switch (finalStatus) {
      case 'success':
        return VI.paymentResult.successTitle;
      case 'failed':
        return VI.paymentResult.failedTitle;
      case 'cancelled':
        return VI.paymentResult.cancelledTitle;
      case 'pending':
        return VI.paymentResult.pendingTitle ?? VI.paymentResult.unknownTitle;
      default:
        return VI.paymentResult.unknownTitle;
    }
  };

  const getDescription = () => {
    if (isLoading) return VI.paymentResult.verifying;
    if (error) return error;
    if (isTokenContext && finalStatus === 'success') {
      return VI.paymentResult.tokenSuccessDesc;
    }
    switch (finalStatus) {
      case 'success':
        return VI.paymentResult.successDesc;
      case 'failed':
        return VI.paymentResult.failedDesc;
      case 'cancelled':
        return VI.paymentResult.cancelledDesc;
      case 'pending':
        return VI.paymentResult.pendingDesc ?? 'Thanh toÃ¡n Ä‘ang Ä‘Æ°á»£c xá»­ lÃ½. Vui lÃ²ng chá».';
      default:
        return VI.paymentResult.unknownDesc;
    }
  };

  const tokenHubPath = getTokenHubPathForCurrentUser();

  React.useEffect(() => {
    if (isTokenContext && isSuccess) {
      window.dispatchEvent(new Event('profile:refresh'));
    }
  }, [isTokenContext, isSuccess]);

  const handlePrimaryAction = () => {
    if (redirectUrl) {
      const separator = redirectUrl.includes('?') ? '&' : '?';
      navigate(`${redirectUrl}${separator}topup=success`);
      return;
    }
    if (isTokenContext) {
      navigate(tokenHubPath);
      return;
    }
    if (isSuccess) {
      navigate('/profile/purchase-history');
      return;
    }
    navigate('/profile/wallet');
  };

  const getPrimaryCtaLabel = () => {
    if (isTokenContext && isSuccess) return VI.paymentResult.tokenPrimarySuccessCta;
    if (isSuccess) return VI.paymentResult.primarySuccessCta;
    return VI.paymentResult.primaryFailedCta;
  };

  const getHomeRedirectPath = () => {
    const roles = getRoles() as UserRole[];
    return getRedirectPath(roles);
  };

  const idLabel = isTokenContext
    ? VI.paymentResult.transactionIdLabel
    : VI.paymentResult.orderIdLabel;

  return (
    <section className="min-h-screen bg-[image:var(--gradient-shop-page)] bg-[length:100%_100%] bg-no-repeat pb-20">
      <div className="mx-auto flex max-w-lg items-center justify-center px-4 pt-16">
        <div className="w-full rounded-3xl border border-white/80 bg-white/80 p-8 text-center shadow-xl">
          <div className="mb-6 flex justify-center">
            {isLoading ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <svg className="h-10 w-10 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </div>
            ) : isSuccess ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
                <CheckCircle2 className="h-10 w-10 text-pink-500" strokeWidth={2} />
              </div>
            ) : finalStatus === 'pending' ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                <Clock className="h-10 w-10 text-amber-600" strokeWidth={2} />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-10 w-10 text-red-600" strokeWidth={2} />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-semibold text-slate-900">{getTitle()}</h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">{getDescription()}</p>

          {rawOrderId && rawOrderId !== 'unknown' && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">{idLabel}</p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-900">{rawOrderId}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Button variant="default" size="lg" className="w-full rounded-full" onClick={handlePrimaryAction}>
              {getPrimaryCtaLabel()}
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

