/**
 * useCreateService Hook
 *
 * Manages service creation: loading state, submission, and error handling.
 * Called by the service creation page only.
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { submitService } from '../services/service.service';
import type {
  CreateServiceFormData,
  ServiceType,
} from '../types';
import { VI } from '@/shared/i18n/vi';

interface UseCreateServiceResult {
  submitting: boolean;
  submit: (formData: CreateServiceFormData) => Promise<boolean>;
}

// Normalize Ant Design InputNumber values that may arrive as formatted strings
const num = (val: string | number): number => Number(String(val).replace(/,/g, ''));

export function useCreateService(): UseCreateServiceResult {
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async (formData: CreateServiceFormData): Promise<boolean> => {
    const minPrice = num(formData.minPrice);
    const maxPrice = num(formData.maxPrice);

    // Validate required fields
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

    setSubmitting(true);
    try {
      await submitService(formData);
      message.success(VI.service.create.messages.createSuccess);
      return true;
    } catch {
      message.error(VI.service.create.messages.createError);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submitting, submit };
}

/**
 * Derives the service type label from a role constant.
 */
export function getServiceTypeLabel(serviceType: ServiceType): string {
  return serviceType;
}
