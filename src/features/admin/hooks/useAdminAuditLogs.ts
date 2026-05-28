import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { getAuditLogs } from '../api/adminReports.api';

export interface AuditLogRow {
  id: number;
  createdAt?: string;
  actor?: string;
  action?: string;
  entityType?: string;
  entityId?: number;
  detail?: string;
}

export function useAdminAuditLogs() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<AuditLogRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { content, totalElements } = await getAuditLogs(page, pageSize);
      setRows(content);
      setTotal(totalElements);
    } catch {
      message.error('Không thể tải nhật ký hệ thống');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  return {
    loading,
    rows,
    total,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch: fetchLogs,
  };
}
