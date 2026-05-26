import { useCallback, useEffect, useState } from 'react';
import { Table, Button as AntButton, Modal, Input, message } from 'antd';
import type { TableProps } from 'antd';
import { SettingOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button as UiButton } from '@/components/ui/button';
import { listSystemConfigs, updateSystemConfig } from '../services/adminSystemConfigs.service';
import type { SystemConfig } from '../api/adminSystemConfigs.api';

const { TextArea } = Input;

export default function AdminSystemConfigsPage() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Edit modal state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listSystemConfigs();
      setConfigs(data);
    } catch (error: any) {
      console.error('Failed to load configs', error);
      message.error(error.message || 'Không thể tải cấu hình hệ thống');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchConfigs();
  }, [fetchConfigs]);

  const handleEditClick = (record: SystemConfig) => {
    setEditingConfig(record);
    setEditValue(record.configValue);
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editingConfig) return;
    
    if (!editValue.trim()) {
      message.warning('Giá trị không được để trống');
      return;
    }
    
    setSaving(true);
    try {
      await updateSystemConfig(editingConfig.configKey, editValue);
      message.success('Cập nhật thành công');
      setIsEditModalVisible(false);
      void fetchConfigs();
    } catch (error: any) {
      message.error(error.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const columns: TableProps<SystemConfig>['columns'] = [
    {
      title: 'Khóa cấu hình',
      dataIndex: 'configKey',
      key: 'configKey',
      width: '20%',
      render: (text: string) => <span className="font-semibold text-cosmate-primary">{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: 'Nội dung (Prompt / Data)',
      dataIndex: 'configValue',
      key: 'configValue',
      render: (text: string) => (
        <div className="max-h-32 overflow-y-auto whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">
          {text}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <AntButton 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => handleEditClick(record)}
          size="small"
        >
          Sửa
        </AntButton>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .admin-config-row:hover { background-color: var(--muted) !important; }
      `}</style>

      <div className="flex h-full w-full flex-col">
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SettingOutlined className="text-xl text-cosmate-info" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Cấu hình Hệ thống & AI Prompts</h2>
                <p className="text-sm text-muted-foreground">Quản lý các thông số cấu hình và prompt cho AI</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <UiButton variant="cosmateOutline" disabled={loading} onClick={() => void fetchConfigs()}>
                <ReloadOutlined className={loading ? 'animate-spin' : ''} />
                Làm mới
              </UiButton>
            </div>
          </div>
        </div>

        <Table<SystemConfig>
          columns={columns}
          dataSource={configs}
          loading={loading}
          rowKey="configKey"
          rowClassName={() => 'admin-config-row'}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </div>

      <Modal
        title={`Chỉnh sửa cấu hình: ${editingConfig?.configKey}`}
        open={isEditModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalVisible(false)}
        confirmLoading={saving}
        width={700}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <div className="flex flex-col gap-3 py-4">
          <div>
            <label className="mb-1 block font-semibold text-gray-700">Mô tả:</label>
            <div className="text-gray-600">{editingConfig?.description}</div>
          </div>
          <div>
            <label className="mb-1 block font-semibold text-gray-700">Giá trị cấu hình (Prompt / Data):</label>
            <TextArea 
              rows={12} 
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)}
              className="font-mono text-sm"
              placeholder="Nhập nội dung cấu hình..."
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
