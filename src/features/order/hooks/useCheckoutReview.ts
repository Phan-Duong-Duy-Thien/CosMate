import { useState, useEffect, useCallback, useMemo } from 'react';
import { message } from 'antd';
import type { NavigateFunction } from 'react-router';
import { getUserAddresses } from '@/features/profile/services/userAddress.service';
import { fetchWalletInfo } from '@/features/profile/services/wallet.service';
import { submitOrderAndHandleResult } from '../services/order.service';
import { loadDraft, loadCheckoutSelections, saveCheckoutSelections, clearCheckoutSelections } from '../utils/rentalDraftStorage';
import { getCostumeById } from '@/features/costume-rental/api/costumeRental.api';
import type { Costume } from '@/features/costume-rental/types';
import type { PaymentMethod } from '../types';
import { getReturnUrl } from '../utils/paymentReturnUrls';
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
  /** Save current checkout selections and navigate to wallet top-up */
  navigateToTopUp: () => void;
}

export type UseCheckoutReviewReturn = CheckoutState & CheckoutActions;

export function useCheckoutReview(navigate: NavigateFunction): UseCheckoutReviewReturn {
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

      // Restore checkout selections if returning from wallet top-up
      const isReturningFromTopUp = new URLSearchParams(window.location.search).get('topup') === 'success';
      const savedSelections = isReturningFromTopUp ? loadCheckoutSelections() : null;

      setState((prev) => ({
        ...prev,
        userId,
        draft,
        // Restore persisted selections (address, payment method, policy)
        ...(savedSelections ? {
          selectedAddressId: savedSelections.selectedAddressId,
          paymentMethod: savedSelections.paymentMethod,
          policyAccepted: savedSelections.policyAccepted,
        } : {}),
      }));

      // Clean up saved selections after restore
      if (savedSelections) {
        clearCheckoutSelections();
      }

      // Fetch addresses and costume detail in parallel
      const promises: Promise<void>[] = [];

      if (userId) {
        promises.push(
          getUserAddresses(userId)
            .then((addresses) => setState((prev) => ({ ...prev, addresses })))
            .catch(() => { message.error('Không thể tải danh sách địa chỉ.'); setState((prev) => ({ ...prev, error: 'Không thể tải địa chỉ.' })); })
        );
      }

      if (draft?.costumeId) {
        promises.push(
          getCostumeById(draft.costumeId)
            .then((res) => setState((prev) => ({ ...prev, costume: res.result })))
            .catch(() => { message.error('Không thể tải thông tin trang phục.'); setState((prev) => ({ ...prev, error: 'Không thể tải thông tin trang phục.' })); })
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

  // Refetch wallet balance when returning from top-up (wallet service redirects back with topup=success)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('topup') === 'success' && state.userId) {
      // Force re-fetch by resetting cached balance first
      setState((prev) => ({ ...prev, walletBalance: null }));
      fetchWalletBalance(state.userId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.userId]);

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

    // Calculate prices (gói thuê không áp dụng — không cộng vào tổng)
    const baseRent = costume.pricePerDay * draft.rentDay;
    const accessoriesTotal = selectedAccessories.reduce((sum, a) => sum + a.price, 0);
    const surchargesTotal = costume.surcharges.reduce((sum, s) => sum + s.price, 0);
    const deposit = costume.depositAmount;
    const totalToPay = baseRent + accessoriesTotal + surchargesTotal + deposit;

    return {
      requiredAccessoryIds,
      finalAccessoryIds,
      selectedAccessories,
      baseRent,
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

    if (!userId) { message.error('Vui lòng đăng nhập để tiếp tục.'); setState((prev) => ({ ...prev, error: 'Vui lòng đăng nhập.' })); return; }
    if (!draft) { message.error('Không tìm thấy thông tin đơn thuê. Vui lòng chọn trang phục.'); setState((prev) => ({ ...prev, error: 'Không có thông tin đơn thuê.' })); return; }
    if (!selectedAddressId) { message.error('Bạn chưa chọn địa chỉ nhận hàng.'); setState((prev) => ({ ...prev, error: 'Vui lòng chọn địa chỉ.' })); return; }
    if (!state.policyAccepted) { message.error('Bạn cần đồng ý với điều khoản dịch vụ để tiếp tục.'); setState((prev) => ({ ...prev, error: 'Cần đồng ý điều khoản.' })); return; }

    // Check wallet balance if using WALLET payment
    if (paymentMethod === 'WALLET') {
      if (walletBalance === null) {
        message.error('Đang tải số dư ví. Vui lòng thử lại.');
        setState((prev) => ({ ...prev, error: 'Đang tải số dư ví. Vui lòng thử lại.' }));
        return;
      }
      if (walletBalance < totalToPay) {
        const missing = totalToPay - walletBalance;
        message.error(`Số dư ví không đủ. Bạn cần thêm ${missing.toLocaleString('vi-VN')} VNĐ để thanh toán.`);
        setState((prev) => ({ ...prev, error: `Số dư ví không đủ. Cần thêm ${missing.toLocaleString('vi-VN')}VNĐ.` }));
        return;
      }
    }

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));
    try {
      // returnUrl is used ONLY by MoMo/VNPay for gateway redirects.
      // For WALLET: BE processes internally — omit returnUrl entirely.
      const params: CreateOrderParams = {
        cosplayerId: userId,
        costumeId: draft.costumeId,
        rentDay: draft.rentDay,
        rentStart: draft.rentStart,
        paymentMethod,
        cosplayerAddressId: selectedAddressId,
        selectedAccessoryIds: draft.selectedAccessoryIds,
        selectedRentalOptionId: null,
      };

      // returnUrl must point to BE callback endpoints so BE can receive the payment gateway callback,
      // update DB, then redirect back to FE with a clean URL.
      if (paymentMethod === 'MOMO' || paymentMethod === 'VNPAY') {
        params.returnUrl = getReturnUrl(paymentMethod);
      }

      const result = await submitOrderAndHandleResult(params);

      // WALLET: BE processed internally — use BE response status to navigate.
      if (result.type === 'wallet') {
        navigate(`/payment/result?status=${result.status}&orderId=${result.orderId}`);
        return;
      }

      // MoMo/VNPay: redirect to external payment gateway. BE handles return.
      if (result.type === 'gateway') {
        window.location.href = result.paymentUrl;
        return;
      }

      // Failed: show error message, do NOT redirect.
      message.error('Tạo đơn thất bại. Vui lòng thử lại.');
      setState((prev) => ({ ...prev, error: 'Tạo đơn thất bại. Vui lòng thử lại.' }));
    } catch {
      message.error('Đã xảy ra lỗi khi tạo đơn. Vui lòng thử lại.');
      setState((prev) => ({ ...prev, error: 'Đã xảy ra lỗi khi tạo đơn. Vui lòng thử lại.' }));
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [state, computed, navigate]);

  /** Save current checkout selections to sessionStorage and navigate to wallet top-up */
  const navigateToTopUp = useCallback(() => {
    saveCheckoutSelections({
      selectedAddressId: state.selectedAddressId,
      paymentMethod: state.paymentMethod,
      policyAccepted: state.policyAccepted,
    });
    navigate('/profile/wallet/topup?redirect=/rent/checkout');
  }, [state.selectedAddressId, state.paymentMethod, state.policyAccepted, navigate]);

  return { ...state, computed, setSelectedAddressId, setPolicyAccepted, setPaymentMethod, submitOrder, refetchAddresses, navigateToTopUp };
}
