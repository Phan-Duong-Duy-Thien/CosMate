import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import {
  getAdminReviews,
  toggleReviewToxic,
  type AdminReviewItem,
} from '../api/adminReviews.api';

type ToxicFilter = 'all' | 'toxic' | 'safe';

export function useAdminReviews() {
  const [search, setSearch] = useState('');
  const [toxicFilter, setToxicFilter] = useState<ToxicFilter>('all');
  const [loading, setLoading] = useState(false);
  const [allRows, setAllRows] = useState<AdminReviewItem[]>([]);
  const [toggleLoadingIds, setToggleLoadingIds] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminReviews();
      setAllRows(data);
    } catch {
      message.error('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    setPage(1);
  }, [search, toxicFilter]);

  const filteredRows = useMemo(() => {
    let rows = allRows;

    if (toxicFilter === 'toxic') {
      rows = rows.filter((r) => r.isSpamOrToxic === true);
    } else if (toxicFilter === 'safe') {
      rows = rows.filter((r) => r.isSpamOrToxic !== true);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => {
        const searchText = [
          r.id,
          r.orderId,
          r.username ?? r.userName ?? '',
          r.comment ?? '',
          r.aiSummary ?? '',
          r.aiSentiment ?? '',
        ]
          .join(' ')
          .toLowerCase();
        return searchText.includes(q);
      });
    }

    return rows;
  }, [allRows, search, toxicFilter]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const toggleToxic = useCallback(async (reviewId: number) => {
    setToggleLoadingIds((prev) => new Set(prev).add(reviewId));
    try {
      const updated = await toggleReviewToxic(reviewId);
      setAllRows((prev) => prev.map((row) => (row.id === reviewId ? updated : row)));
      return updated;
    } catch {
      throw new Error('Không thể cập nhật trạng thái kiểm duyệt');
    } finally {
      setToggleLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(reviewId);
        return next;
      });
    }
  }, []);

  return {
    search,
    setSearch,
    toxicFilter,
    setToxicFilter,
    loading,
    allRows,
    filteredRows,
    paginatedRows,
    page,
    setPage,
    pageSize,
    setPageSize,
    toggleLoadingIds,
    toggleToxic,
    refetch: fetchReviews,
  };
}
