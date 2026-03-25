/**
 * Payment Result Page
 * Displays payment result after redirect from payment gateway.
 *
 * Anti-replay guard: Once a payment result (identified by orderId) has been
 * shown on this page, it is marked in sessionStorage. Re-mounting or
 * re-navigating to the same result will not re-trigger any logic.
 * This prevents duplicate processing in StrictMode, back-button scenarios,
 * and any future on-mount effects that read from query params.
 */
import * as React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { VI } from '@/shared/i18n/vi';
import { getRoles } from '@/features/auth/services/tokenStorage';
import { getRedirectPath } from '@/features/auth/utils/roleRedirect';
import type { UserRole } from '@/types/auth';

type PaymentStatus = 'success' | 'failed' | 'cancelled' | 'unknown';

const PROCESSED_KEY_PREFIX = 'cosmate:payment:processed:';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = (searchParams.get('status') as PaymentStatus) || 'unknown';
  const orderId = searchParams.get('orderId') || null;
  const message = searchParams.get('message') || null;

  const isSuccess = status === 'success';

  // Anti-replay guard: only process each orderId once per session.
  // Once this page has been shown for a given orderId, mark it as
  // processed so re-mounts / repeated navigations won't re-trigger anything.
  // This also protects against React StrictMode double-invocation in dev.
  React.useEffect(() => {
    if (orderId) {
      const key = `${PROCESSED_KEY_PREFIX}${orderId}`;
      if (sessionStorage.getItem(key) === '1') {
        // Already shown this result — do nothing on re-mount.
        return;
      }
      sessionStorage.setItem(key, '1');
    }
  }, [orderId]);

  const getTitle = () => {
    switch (status) {
      case 'success':
        return VI.paymentResult.successTitle;
      case 'failed':
        return VI.paymentResult.failedTitle;
      case 'cancelled':
        return VI.paymentResult.cancelledTitle;
      default:
        return VI.paymentResult.unknownTitle;
    }
  };

  const getDescription = () => {
    switch (status) {
      case 'success':
        return VI.paymentResult.successDesc;
      case 'failed':
        return message || VI.paymentResult.failedDesc;
      case 'cancelled':
        return VI.paymentResult.cancelledDesc;
      default:
        return VI.paymentResult.unknownDesc;
    }
  };

  const handlePrimaryAction = () => {
    if (isSuccess) {
      // Get user roles and redirect to appropriate page
      const roles = getRoles() as UserRole[];
      const redirectPath = getRedirectPath(roles);
      navigate(redirectPath);
    } else {
      // Payment failed - go to checkout to retry payment
      navigate('/rent/checkout');
    }
  };

  // Get role-based redirect path for home button
  const getHomeRedirectPath = () => {
    const roles = getRoles() as UserRole[];
    return getRedirectPath(roles);
  };

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#FCE7F3_0%,#FDF2F8_40%,#F8FAFC_100%)] pb-20">
      <div className="mx-auto flex max-w-lg items-center justify-center px-4 pt-16">
        <div className="w-full rounded-3xl border border-white/80 bg-white/80 p-8 shadow-xl text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            {isSuccess ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-10 w-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-slate-900">
            {getTitle()}
          </h1>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {getDescription()}
          </p>

          {/* Order ID */}
          {orderId && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">{VI.paymentResult.orderIdLabel}</p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-900">{orderId}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <Button
              variant="default"
              size="lg"
              className="w-full rounded-full"
              onClick={handlePrimaryAction}
            >
              {isSuccess ? VI.paymentResult.primarySuccessCta : VI.paymentResult.primaryFailedCta}
            </Button>
            <Link to={getHomeRedirectPath()}>
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full"
              >
                {VI.paymentResult.homeCta}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
