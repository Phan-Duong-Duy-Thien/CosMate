import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import * as menuApi from '../api/menu.api';

export function useMenuManagement() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await menuApi.getMenus();
      setMenus(data);
    } catch (error) { message.error('Lỗi khi tải danh sách Menu'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMenus(); }, [fetchMenus]);

  const handleToggleMenu = async (id: string) => {
    try {
      await menuApi.toggleMenuStatus(id);
      message.success('Cập nhật trạng thái thành công!');
      fetchMenus();
      window.dispatchEvent(new Event('menuUpdated'));
    } catch (error) { message.error('Lỗi cập nhật'); }
  };

  const handleCreateMenu = async (values: any) => {
    try {
      await menuApi.createMenu(values);
      message.success('Tạo Nhóm Menu thành công!');
      fetchMenus();
      window.dispatchEvent(new Event('menuUpdated'));
    }
    catch (error) { message.error('Lỗi tạo Menu'); }
  };

  const handleDeleteMenu = async (id: string) => {
    try {
      await menuApi.deleteMenu(id);
      message.success('Xóa Menu thành công!');
      fetchMenus();
      window.dispatchEvent(new Event('menuUpdated'));
    }
    catch (error) { message.error('Lỗi xóa Menu'); }
  };

  const handleCreateMenuItem = async (values: any) => {
    try {
      await menuApi.createMenuItem(values);
      message.success('Thêm Link thành công! Sidebar đã tự cập nhật.');
      fetchMenus();
      window.dispatchEvent(new Event('menuUpdated'));
    }
    catch (error) { message.error('Lỗi thêm Item'); }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await menuApi.deleteMenuItem(id);
      message.success('Xóa Link thành công!');
      fetchMenus();
      window.dispatchEvent(new Event('menuUpdated'));
    }
    catch (error) { message.error('Lỗi xóa Item'); }
  };

  // --- Logic Download / Upload ---
  const triggerDownload = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click(); link.remove(); window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await menuApi.exportMenusExcel();
      triggerDownload(blob, `menu_export_${new Date().getTime()}.xlsx`);
      message.success('Xuất file thành công!');
    } catch (err) { message.error('Backend chưa hỗ trợ API Xuất Excel Menu (HTTP 404)'); }
    finally { setIsExporting(false); }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await menuApi.downloadMenuTemplate();
      triggerDownload(blob, `menu_template.xlsx`);
    } catch (err) { message.error('Backend chưa hỗ trợ API Tải Template Menu (HTTP 404)'); }
  };

  const handleImport = async (file: File) => {
    try {
      setIsImporting(true);
      await menuApi.importMenusExcel(file);
      message.success(`Import Menu thành công!`);
      fetchMenus();
      window.dispatchEvent(new Event('menuUpdated'));
    } catch (err) { message.error('Backend chưa hỗ trợ API Nhập Excel Menu (HTTP 404)'); }
    finally { setIsImporting(false); }
  };

  return {
    menus, loading, fetchMenus,
    handleToggleMenu, handleCreateMenu, handleDeleteMenu,
    handleCreateMenuItem, handleDeleteMenuItem,
    isExporting, isImporting, handleExport, handleDownloadTemplate, handleImport
  };
}