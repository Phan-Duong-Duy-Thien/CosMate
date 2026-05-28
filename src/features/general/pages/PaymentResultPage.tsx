/**
 * Payment Result Page
 * Displays payment result after redirect from payment gateway.
 *
 * Handles costume orders, service orders, wallet top-up (context=wallet), and AI token purchases (context=token).
 */
import * as React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { VI } from '@/shared/i18n/vi';
import { cn } from '@/lib/utils';
import { getRoles } from '@/features/auth/services/tokenStorage';
import { getRedirectPath } from '@/features/auth/utils/roleRedirect';
import { getTokenHubPathForCurrentUser } from '@/features/profile/utils/tokenRoutes';
import { usePaymentVerification } from '@/features/order/hooks/usePaymentVerification';
import { useServiceOrderVerification } from '@/features/service/hooks/useServiceOrderVerification';
import { CHECKOUT_PATH } from '@/features/order/utils/checkoutNavigation';
import type { UserRole } from '@/types/auth';
import { CheckCircle2, XCircle, Clock, Loader2, Sparkles } from 'lucide-react';
import {
  notifyOrdersChanged,
  notifyServiceOrdersChanged,
  notifyWalletChanged,
  notifyTokenChanged,
} from '@/shared/sync/dataSync';

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
  const isWalletContext = searchParams.get('context') === 'wallet';
  const { status: urlStatus, orderId: rawOrderId } = parseUrlHint();
  const redirectUrl = searchParams.get('redirect') || null;

  const verifyOrderId = isTokenContext || isWalletContext ? null : rawOrderId;

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
  if (isTokenContext || isWalletContext) {
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
    !isWalletContext &&
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
    if (isWalletContext && finalStatus === 'success') {
      return VI.paymentResult.walletSuccessTitle;
    }
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
    if (isWalletContext && finalStatus === 'success') {
      return VI.paymentResult.walletSuccessDesc;
    }
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
        return VI.paymentResult.pendingDesc;
      default:
        return VI.paymentResult.unknownDesc;
    }
  };

  const tokenHubPath = getTokenHubPathForCurrentUser();

  React.useEffect(() => {
    if (!isSuccess) return;
    if (isTokenContext) {
      window.dispatchEvent(new Event('profile:refresh'));
      notifyTokenChanged();
    }
    if (isWalletContext) {
      notifyWalletChanged();
      return;
    }
    if (serviceResolved) {
      notifyServiceOrdersChanged();
      return;
    }
    notifyOrdersChanged();
  }, [isSuccess, isTokenContext, isWalletContext, serviceResolved]);

  const handlePrimaryAction = () => {
    if (redirectUrl) {
      const separator = redirectUrl.includes('?') ? '&' : '?';
      const resumeParam = isWalletContext || redirectUrl.startsWith(CHECKOUT_PATH) ? 'topup=success' : '';
      navigate(resumeParam ? `${redirectUrl}${separator}${resumeParam}` : redirectUrl);
      return;
    }
    if (isWalletContext && isSuccess) {
      navigate('/profile/wallet');
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
    if (isWalletContext) {
      navigate('/profile/wallet');
      return;
    }
    if (isTokenContext) {
      navigate('/profile/token');
      return;
    }
    navigate('/profile/wallet');
  };

  const getPrimaryCtaLabel = () => {
    if (isWalletContext && isSuccess) return VI.paymentResult.walletPrimarySuccessCta;
    if (isTokenContext && isSuccess) return VI.paymentResult.tokenPrimarySuccessCta;
    if (isWalletContext) return VI.paymentResult.walletPrimaryFailedCta;
    if (isSuccess) return VI.paymentResult.primarySuccessCta;
    return VI.paymentResult.primaryFailedCta;
  };

  const getHomeRedirectPath = () => {
    const roles = getRoles() as UserRole[];
    return getRedirectPath(roles);
  };

  const idLabel =
    isTokenContext || isWalletContext
      ? VI.paymentResult.transactionIdLabel
      : VI.paymentResult.orderIdLabel;

  const showTransactionId =
    rawOrderId && rawOrderId !== 'unknown' && (!isWalletContext || isSuccess);

  const statusIconShell = isLoading
    ? 'border-indigo-950/30 bg-white'
    : isSuccess
      ? 'border-indigo-950 bg-gradient-to-br from-pink-200 via-rose-100 to-violet-100'
      : finalStatus === 'pending'
        ? 'border-amber-800 bg-amber-50'
        : 'border-red-800/80 bg-red-50';

  return (
    <div className="home-anime relative isolate min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)] pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(50vh,420px)] w-full opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(76, 29, 149, 0.1) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />

      <main className="relative z-[1] mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg items-center justify-center px-4 py-10 sm:py-14">
        <section
          className={cn(
            'w-full rounded-[1.35rem] border-[4px] border-indigo-950 bg-gradient-to-br from-[#fffbeb] via-pink-50/80 to-violet-100',
            'p-6 text-center shadow-[12px_12px_0_0_rgba(30,27,75,0.35)] sm:p-8'
          )}
        >
          <div className="mb-5 flex justify-center">
            <span
              className={cn(
                'inline-flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border-[3px] shadow-[5px_5px_0_0_#1e1b4b]',
                statusIconShell
              )}
            >
              {isLoading ? (
                <Loader2 className="h-10 w-10 animate-spin text-indigo-950/50" aria-hidden />
              ) : isSuccess ? (
                <CheckCircle2 className="h-10 w-10 text-pink-600" strokeWidth={2.25} aria-hidden />
              ) : finalStatus === 'pending' ? (
                <Clock className="h-10 w-10 text-amber-700" strokeWidth={2.25} aria-hidden />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" strokeWidth={2.25} aria-hidden />
              )}
            </span>
          </div>

          {isSuccess && !isLoading && (
            <p className="mb-2 inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-indigo-950 bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-indigo-950 shadow-[3px_3px_0_0_#1e1b4b]">
              <Sparkles className="h-3 w-3 text-cosmate-pink" aria-hidden />
              CosMate
            </p>
          )}

          <h1
            className={cn(
              'text-2xl font-extrabold leading-tight tracking-tight text-indigo-950 sm:text-[1.65rem]',
              isSuccess &&
                !isLoading &&
                'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent'
            )}
          >
            {getTitle()}
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-relaxed text-indigo-950/80">
            {getDescription()}
          </p>

          {showTransactionId && (
            <div className="mx-auto mt-6 max-w-xs rounded-2xl border-[3px] border-indigo-950/25 bg-white/90 px-4 py-3 shadow-[4px_4px_0_0_rgba(30,27,75,0.12)]">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-indigo-800/65">
                {idLabel}
              </p>
              <p className="mt-1 font-mono text-lg font-extrabold tabular-nums text-indigo-950">
                {rawOrderId}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Button
              type="button"
              size="lg"
              className={cn(
                'h-12 w-full rounded-xl border-[3px] border-indigo-950 text-base font-extrabold shadow-[6px_6px_0_0_#1e1b4b]',
                isSuccess
                  ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:brightness-105'
                  : 'bg-cosmate-soft-pink text-indigo-950 hover:bg-cosmate-pink/35'
              )}
              onClick={handlePrimaryAction}
              disabled={isLoading}
            >
              {getPrimaryCtaLabel()}
            </Button>
            <Link
              to={getHomeRedirectPath()}
              className={cn(
                buttonVariants({ variant: 'cosmateOutline', size: 'lg' }),
                'inline-flex h-12 w-full rounded-xl border-[3px] border-indigo-950 bg-white font-extrabold text-indigo-950 shadow-[4px_4px_0_0_rgba(30,27,75,0.2)] hover:bg-amber-50'
              )}
            >
              {VI.paymentResult.homeCta}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

