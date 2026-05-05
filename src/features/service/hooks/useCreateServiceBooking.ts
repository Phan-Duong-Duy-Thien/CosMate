/**
 * useCreateServiceBooking Hook
 *
 * Creates a service booking (photographer / event staff) from chat context.
 * Called by pages/components only; never by other hooks or services.
 */
import { useState, useCallback } from 'react'
import { message } from 'antd'
import { submitServiceBooking, type CreateServiceBookingParams } from '../services/booking.service'
import type { ServiceBookingResult } from '../api/booking.api'
import { VI } from '@/shared/i18n/vi'

interface UseCreateServiceBookingResult {
  createBooking: (params: CreateServiceBookingParams) => Promise<ServiceBookingResult | null>
  loading: boolean
  error: string | null
}

export function useCreateServiceBooking(): UseCreateServiceBookingResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBooking = useCallback(
    async (params: CreateServiceBookingParams): Promise<ServiceBookingResult | null> => {
      setLoading(true)
      setError(null)
      try {
        const result = await submitServiceBooking(params)
        message.success(VI.booking.create.success)
        return result
      } catch (err) {
        const msg = VI.booking.create.error
        setError(msg)
        message.error(msg)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { createBooking, loading, error }
}
