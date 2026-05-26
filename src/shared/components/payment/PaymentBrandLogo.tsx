import { cn } from '@/lib/utils';
import momoLogo from '@/assets/payment/momo.svg';
import vnpayLogo from '@/assets/payment/vnpay.svg';

export type PaymentBrand = 'MOMO' | 'VNPAY';

const LOGO_BY_BRAND: Record<PaymentBrand, { src: string; alt: string }> = {
  MOMO: { src: momoLogo, alt: 'MoMo' },
  VNPAY: { src: vnpayLogo, alt: 'VNPAY' },
};

interface PaymentBrandLogoProps {
  brand: PaymentBrand;
  className?: string;
}

export function PaymentBrandLogo({ brand, className }: PaymentBrandLogoProps) {
  const { src, alt } = LOGO_BY_BRAND[brand];
  return (
    <img
      src={src}
      alt={alt}
      className={cn('h-7 w-auto max-w-[5.5rem] object-contain object-left', className)}
      loading="lazy"
      decoding="async"
    />
  );
}
