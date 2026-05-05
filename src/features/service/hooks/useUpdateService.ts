/**
 * useUpdateService Hook
 *
 * Manages service update: loading state, submission, and error handling.
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { updateService } from '../services/service.service';
import type { CreateServiceFormData } from '../types';
import { VI } from '@/shared/i18n/vi';

// Normalize Ant Design InputNumber values that may arrive as formatted strings
const num = (val: string | number): number => Number(String(val).replace(/,/g, ''));

interface UseUpdateServiceResult {
  updating: boolean;
  update: (serviceId: number, formData: CreateServiceFormData) => Promise<boolean>;
}

export function useUpdateService(): UseUpdateServiceResult {
  const [updating, setUpdating] = useState(false);

  const update = useCallback(async (serviceId: number, formData: CreateServiceFormData): Promise<boolean> => {
    const minPrice = num(formData.minPrice);
    const maxPrice = num(formData.maxPrice);

    // Validate required fields (same rules as create)
    if (!formData.description.trim()) {
      message.error(VI.service.create.validation.required);
      return false;
    }
    if (num(formData.slotDurationHours) <= 0) {
      message.error(VI.service.create.validation.positiveNumber);
      return false;
    }
    if (num(formData.pricePerSlot) < 0) {
      message.error(VI.service.create.validation.nonNegativeNumber);
      return false;
    }
    if (num(formData.equipmentDepreciationCost) < 0) {
      message.error(VI.service.create.validation.nonNegativeNumber);
      return false;
    }
    if (num(formData.depositAmount) < 0) {
      message.error(VI.service.create.validation.nonNegativeNumber);
      return false;
    }
    if (minPrice < 0 || maxPrice < 0) {
      message.error(VI.service.create.validation.nonNegativeNumber);
      return false;
    }
    if (maxPrice > 0 && minPrice > maxPrice) {
      message.error(VI.service.create.validation.minMaxRange);
      return false;
    }
    if (formData.areas.length === 0) {
      message.error(VI.service.create.validation.areaRequired);
      return false;
    }

    setUpdating(true);
    try {
      await updateService(serviceId, formData);
      message.success(VI.service.edit?.messages?.updateSuccess ?? VI.service.create.messages.createSuccess);
      return true;
    } catch {
      message.error(VI.service.edit?.messages?.updateError ?? VI.service.create.messages.createError);
      return false;
    } finally {
      setUpdating(false);
    }
  }, []);

  return { updating, update };
}