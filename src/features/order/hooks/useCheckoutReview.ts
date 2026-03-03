import { useState, useEffect, useCallback, useMemo } from 'react';
import { getUserAddresses } from '@/features/profile/services/userAddress.service';
import { fetchWalletInfo } from '@/features/profile/services/wallet.service';
import { submitOrderAndHandleResult } from '../services/order.service';
import { loadDraft, clearDraft } from '../utils/rentalDraftStorage';
import { getCostumeById } from '@/features/costume-rental/api/costumeRental.api';
import type { Costume, PaymentMethod } from '@/features/costume-rental/types';
import { getUserId } from '@/features/auth/services/tokenStorage';

interface CheckoutState {
  addresses: UserAddress[];
  draft: RentalDraft | null;
  costume: Costume | null;
  userId: number | null;
  selectedAddressId: number | null;
  policyAccepted: boolean;
  paymentMethod: PaymentMethod;
  walletBalance: number | null;
  isLoadingWallet: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

interface CheckoutActions {
  setSelectedAddressId: (id: number | null) => void;
  setPolicyAccepted: (accepted: boolean) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  submitOrder: () => Promise<void>;
  refetchAddresses: () => Promise<void>;
}

export type UseCheckoutReviewReturn = CheckoutState & CheckoutActions;

export function useCheckoutReview(): UseCheckoutReviewReturn {
  const [state, setState] = useState<CheckoutState>({
    addresses: [],
    draft: null,
    costume: null,
    userId: null,
    selectedAddressId: null,
    policyAccepted: false,
    paymentMethod: 'MOMO',
    walletBalance: null,
    isLoadingWallet: false,
    isLoading: true,
    isSubmitting: false,
    error: null,
  });

  // Fetch wallet balance when payment method changes to WALLET
  const fetchWalletBalance = useCallback(async (userId: number) => {
    setState((prev) => ({ ...prev, isLoadingWallet: true, error: null }));
    try {
      const walletInfo = await fetchWalletInfo(userId);
      setState((prev) => ({ ...prev, walletBalance: walletInfo.balance, isLoadingWallet: false }));
    } catch {
      setState((prev) => ({ ...prev, walletBalance: null, isLoadingWallet: false, error: 'Không thể tải số dư ví.' }));
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const userId = getUserId();
      const draft = loadDraft();
      setState((prev) => ({ ...prev, userId, draft }));

      // Fetch addresses and costume detail in parallel
      const promises: Promise<void>[] = [];

      if (userId) {
        promises.push(
          getUserAddresses(userId)
            .then((addresses) => setState((prev) => ({ ...prev, addresses })))
            .catch(() => setState((prev) => ({ ...prev, error: 'Không thể tải địa chỉ.' })))
        );
      }

      if (draft?.costumeId) {
        promises.push(
          getCostumeById(draft.costumeId)
            .then((res) => setState((prev) => ({ ...prev, costume: res.result })))
            .catch(() => setState((prev) => ({ ...prev, error: 'Không thể tải thông tin trang phục.' })))
        );
      }

      await Promise.all(promises);
      setState((prev) => ({ ...prev, isLoading: false }));
    };
    init();
  }, []);

  // Fetch wallet info when paymentMethod becomes WALLET
  useEffect(() => {
    if (state.paymentMethod === 'WALLET' && state.userId && state.walletBalance === null && !state.isLoadingWallet) {
      fetchWalletBalance(state.userId);
    }
  }, [state.paymentMethod, state.userId, state.walletBalance, state.isLoadingWallet, fetchWalletBalance]);

  // Computed values
  const computed = useMemo(() => {
    const { draft, costume } = state;
    if (!draft || !costume) return null;

    // Required accessory IDs (always included)
    const requiredAccessoryIds = costume.accessories.filter(a => a.isRequired).map(a => a.id);
    // Union of selected + required
    const finalAccessoryIds = [...new Set([...draft.selectedAccessoryIds, ...requiredAccessoryIds])];

    // Get selected accessories
    const selectedAccessories = costume.accessories.filter(a => finalAccessoryIds.includes(a.id));

    // Get selected rental option
    const selectedRentalOption = costume.rentalOptions.find(o => o.id === draft.selectedRentalOptionId) ?? null;

    // Calculate prices
    const baseRent = costume.pricePerDay * draft.rentDay;
    const rentalOptionPrice = selectedRentalOption?.price ?? 0;
    const accessoriesTotal = selectedAccessories.reduce((sum, a) => sum + a.price, 0);
    const surchargesTotal = costume.surcharges.reduce((sum, s) => sum + s.price, 0);
    const deposit = costume.depositAmount;
    const totalToPay = baseRent + rentalOptionPrice + accessoriesTotal + surchargesTotal + deposit;

    return {
      requiredAccessoryIds,
      finalAccessoryIds,
      selectedAccessories,
      selectedRentalOption,
      baseRent,
      rentalOptionPrice,
      accessoriesTotal,
      surchargesTotal,
      deposit,
      totalToPay,
    };
  }, [state.draft, state.costume]);

  const setSelectedAddressId = useCallback((id: number | null) => {
    setState((prev) => ({ ...prev, selectedAddressId: id }));
  }, []);

  const setPolicyAccepted = useCallback((accepted: boolean) => {
    setState((prev) => ({ ...prev, policyAccepted: accepted }));
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setState((prev) => ({ ...prev, paymentMethod: method }));
  }, []);

  const refetchAddresses = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const addresses = await getUserAddresses(userId);
      setState((prev) => ({ ...prev, addresses, isLoading: false }));
    } catch {
      setState((prev) => ({ ...prev, isLoading: false, error: 'Không thể tải địa chỉ.' }));
    }
  }, []);

  const submitOrder = useCallback(async () => {
    const { userId, selectedAddressId, paymentMethod, walletBalance } = state;
    const draft = state.draft;
    const totalToPay = computed?.totalToPay ?? 0;

    if (!userId) { setState((prev) => ({ ...prev, error: 'Vui lòng đăng nhập.' })); return; }
    if (!draft) { setState((prev) => ({ ...prev, error: 'Không có thông tin đơn thuê.' })); return; }
    if (!selectedAddressId) { setState((prev) => ({ ...prev, error: 'Vui lòng chọn địa chỉ.' })); return; }
    if (!state.policyAccepted) { setState((prev) => ({ ...prev, error: 'Cần đồng ý điều khoản.' })); return; }

    // Check wallet balance if using WALLET payment
    if (paymentMethod === 'WALLET') {
      if (walletBalance === null) {
        setState((prev) => ({ ...prev, error: 'Đang tải số dư ví. Vui lòng thử lại.' }));
        return;
      }
      if (walletBalance < totalToPay) {
        const missing = totalToPay - walletBalance;
        setState((prev) => ({ ...prev, error: `Số dư ví không đủ. Bạn cần thêm ${missing.toLocaleString('vi-VN')}VNĐ.` }));
        return;
      }
    }

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));
    try {
      const returnUrl = state.paymentMethod === 'MOMO' ? 'http://localhost:8080/payment/api/momo/return' : 'http://localhost:5173/payment/return';
      const params: CreateOrderParams = {
        cosplayerId: userId,
        costumeId: draft.costumeId,
        rentDay: draft.rentDay,
        rentStart: draft.rentStart,
        paymentMethod: state.paymentMethod,
        returnUrl,
        cosplayerAddressId: selectedAddressId,
        selectedAccessoryIds: draft.selectedAccessoryIds,
        selectedRentalOptionId: draft.selectedRentalOptionId,
      };
      // Service handles redirect logic (gateway or wallet success/fail)
      await submitOrderAndHandleResult(params);
      // If we reach here, something went wrong (service should redirect)
      setState((prev) => ({ ...prev, isSubmitting: false, error: 'Co loi xay ra. Vui long thu lai.' }));
    } catch {
      setState((prev) => ({ ...prev, isSubmitting: false, error: 'Khong the tao don thue.' }));
    }
  }, [state, computed]);

  return { ...state, computed, setSelectedAddressId, setPolicyAccepted, setPaymentMethod, submitOrder, refetchAddresses };
}
