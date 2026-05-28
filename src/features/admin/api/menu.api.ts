import axiosInstance from '@/services/axiosInstance';

export const getMenus = async () => {
  const res = await axiosInstance.get('/api/v1/menus');
  return res.data?.content || res.data?.result || res.data;
};
export const createMenu = async (data: any) => {
  const res = await axiosInstance.post('/api/v1/menus', data);
  return res.data;
};
export const updateMenu = async (id: string, data: any) => {
  const res = await axiosInstance.put(`/api/v1/menus/${id}`, data);
  return res.data;
};
export const updateMenuOrder = async (id: string, displayOrder: number) => {
  return axiosInstance.patch(`/api/v1/menus/${id}/display-order`, null, {
    params: { displayOrder }
  });
};
export const deleteMenu = async (id: string) => {
  const res = await axiosInstance.delete(`/api/v1/menus/${id}`);
  return res.data;
};
export const toggleMenuStatus = async (id: string) => {
  const res = await axiosInstance.post(`/api/v1/menus/${id}/toggle-status`);
  return res.data;
};

export const getMenuItems = async (menuId: string) => {
  const res = await axiosInstance.get(`/api/v1/menu-items/menu/${menuId}/root`);
  return res.data?.result || res.data;
};
export const createMenuItem = async (data: any) => {
  const res = await axiosInstance.post('/api/v1/menu-items', data);
  return res.data;
};
export const updateMenuItem = async (id: string, data: any) => {
  const res = await axiosInstance.put(`/api/v1/menu-items/${id}`, data);
  return res.data;
};
export const updateMenuItemOrder = async (id: string, displayOrder: number) => {
  return axiosInstance.patch(`/api/v1/menu-items/${id}/display-order`, null, {
    params: { displayOrder }
  });
};
export const deleteMenuItem = async (id: string) => {
  const res = await axiosInstance.delete(`/api/v1/menu-items/${id}`);
  return res.data;
};

// --- IMPORT / EXPORT API ---
export const exportMenusExcel = async (): Promise<Blob> => {
  const res = await axiosInstance.get('/api/v1/menus/export', { responseType: 'blob' });
  return res.data;
};
export const downloadMenuTemplate = async (): Promise<Blob> => {
  const res = await axiosInstance.get('/api/v1/menus/template', { responseType: 'blob' });
  return res.data;
};
export const importMenusExcel = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axiosInstance.post('/api/v1/menus/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};