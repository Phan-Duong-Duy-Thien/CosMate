import { useEffect } from 'react';
import { subscribeDataSync, type DataSyncEventName } from '@/shared/sync/dataSync';

/**
 * Refetch when another page/hook dispatches a data-sync event.
 * Keeps duplicate hook instances (e.g. profile counts vs purchase history) aligned.
 */
export function useDataSyncRefetch(
  refetch: () => void | Promise<void>,
  eventName: DataSyncEventName,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;
    return subscribeDataSync(eventName, () => {
      void refetch();
    });
  }, [refetch, eventName, enabled]);
}
