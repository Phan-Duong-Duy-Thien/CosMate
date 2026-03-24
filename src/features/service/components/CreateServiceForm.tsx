/**
 * CreateServiceForm Component
 *
 * Service creation form for PROVIDER_PHOTOGRAPH and PROVIDER_EVENT_STAFF roles.
 * Uses shared Vietnam location hook for area selection.
 * All text via i18n.
 */
import { useState, useEffect, useRef } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  Card,
  Typography,
  Space,
  Tag,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import type { ServiceType } from '../types';
import type { UserAddress } from '@/features/profile/types';
import { useVietnamLocations } from '@/shared/hooks/useVietnamLocations';
import { useCreateService } from '../hooks/useCreateService';
import type { ServiceArea } from '../types';
import { VI } from '@/shared/i18n/vi';

const { TextArea } = Input;
const { Text } = Typography;

interface CreateServiceFormProps {
  serviceType: ServiceType;
  providerId: number;
  shopAddress?: UserAddress | null;
  onSuccess?: () => void;
}

export function CreateServiceForm({
  serviceType,
  providerId,
  shopAddress,
  onSuccess,
}: CreateServiceFormProps) {
  const [form] = Form.useForm();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const prefilledRef = useRef(false);
  const { submit, submitting } = useCreateService();

  const {
    selectedProvinceId,
    selectedCommuneId,
    provinces,
    communes,
    isLoadingProvinces,
    isLoadingCommunes,
    setSelectedProvinceId,
    setSelectedCommuneId,
    selectedProvince,
    selectedCommune,
  } = useVietnamLocations();

  // Prefill area from shop address on mount (only once)
  useEffect(() => {
    if (prefilledRef.current) return;
    if (shopAddress?.city && shopAddress?.district) {
      prefilledRef.current = true;
      const initialArea: ServiceArea = {
        city: shopAddress.city,
        district: shopAddress.district,
      };
      setAreas((prev) => {
        const exists = prev.some(
          (a) => a.city === initialArea.city && a.district === initialArea.district
        );
        return exists ? prev : [initialArea, ...prev];
      });
    }
  }, [shopAddress]);

  const handleAddArea = () => {
    if (!selectedProvince || !selectedCommune) return;

    const newArea: ServiceArea = {
      city: selectedProvince.name,
      district: selectedCommune.name,
    };

    // Avoid duplicates
    const exists = areas.some(
      (a) => a.city === newArea.city && a.district === newArea.district
    );
    if (exists) return;

    setAreas((prev) => [...prev, newArea]);
    setSelectedProvinceId(null);
    setSelectedCommuneId(null);
  };

  const handleRemoveArea = (index: number) => {
    setAreas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFilesChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFiles(fileList);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const albumFiles: File[] = files
        .filter((f) => f.originFileObj)
        .map((f) => f.originFileObj as File);

      const ok = await submit({
        serviceType,
        providerId,
        description: values.description ?? '',
        slotDurationHours: values.slotDurationHours ?? 1,
        pricePerSlot: values.pricePerSlot ?? 0,
        equipmentDepreciationCost: values.equipmentDepreciationCost ?? 0,
        depositAmount: values.depositAmount ?? 0,
        areas,
        albumFiles,
        minPrice: values.minPrice ?? 0,
        maxPrice: values.maxPrice ?? 0,
      });

      if (ok) {
        form.resetFields();
        setFiles([]);
        setAreas([]);
        onSuccess?.();
      }
    } catch {
      // Validation errors shown by Ant Design
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Type & Provider ID — read-only */}
      <Card style={{ borderRadius: 12 }}>
        <Space orientation="vertical" size={4} style={{ width: '100%' }}>
          <div className="flex items-center gap-3">
            <Text type="secondary">{VI.service.create.form.serviceType}:</Text>
            <Tag color="purple">{serviceType}</Tag>
          </div>
          <div className="flex items-center gap-3">
            <Text type="secondary">{VI.service.create.form.providerId}:</Text>
            <Text strong>{providerId}</Text>
          </div>
        </Space>
      </Card>

      {/* Location Areas */}
      <Card
        title={VI.service.create.form.areas}
        style={{ borderRadius: 12 }}
      >
        <Space orientation="vertical" size={8} style={{ width: '100%' }}>
          <div className="flex gap-3 flex-wrap">
            <Select
              placeholder={VI.profile.address.form.cityPlaceholder}
              value={selectedProvinceId}
              onChange={setSelectedProvinceId}
              loading={isLoadingProvinces}
              style={{ minWidth: 200 }}
              options={provinces.map((p) => ({
                label: p.name,
                value: p.code,
              }))}
            />
            <Select
              placeholder={VI.profile.address.form.districtPlaceholder}
              value={selectedCommuneId}
              onChange={setSelectedCommuneId}
              disabled={selectedProvinceId === null}
              loading={isLoadingCommunes}
              style={{ minWidth: 200 }}
              options={communes.map((c) => ({
                label: c.name,
                value: c.code,
              }))}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddArea}
              disabled={!selectedProvince || !selectedCommune}
            >
              {VI.service.create.form.addArea}
            </Button>
          </div>

          {areas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {areas.map((area, i) => (
                <Tag
                  key={i}
                  closable
                  onClose={() => handleRemoveArea(i)}
                  color="blue"
                >
                  {area.city} / {area.district}
                </Tag>
              ))}
            </div>
          )}

          {areas.length === 0 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {VI.service.create.form.areasHint}
            </Text>
          )}
        </Space>
      </Card>

      {/* Basic Info */}
      <Card title={VI.service.create.form.basicInfo} style={{ borderRadius: 12 }}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="description"
            label={VI.service.create.form.description}
            rules={[{ required: true }]}
          >
            <TextArea
              rows={4}
              placeholder={VI.service.create.form.descriptionPlaceholder}
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="slotDurationHours"
              label={VI.service.create.form.slotDurationHours}
              rules={[{ required: true, min: 0.5 }]}
              initialValue={1}
            >
              <Space.Compact style={{ width: '100%' }}>
                <InputNumber min={0.5} step={0.5} style={{ width: '100%' }} />
                <Input suffix="h" style={{ width: 60 }} disabled />
              </Space.Compact>
            </Form.Item>

            <Form.Item
              name="pricePerSlot"
              label={VI.service.create.form.pricePerSlot}
              rules={[{ required: true, min: 0 }]}
              initialValue={0}
            >
              <Space.Compact style={{ width: '100%' }}>
                <InputNumber
                  min={0}
                  step={10000}
                  style={{ width: '100%' }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/,/g, '') as unknown as 0}
                />
                <Input suffix="VND" style={{ width: 60 }} disabled />
              </Space.Compact>
            </Form.Item>

            <Form.Item
              name="equipmentDepreciationCost"
              label={VI.service.create.form.equipmentDepreciationCost}
              rules={[{ required: false }]}
              initialValue={0}
            >
              <Space.Compact style={{ width: '100%' }}>
                <InputNumber
                  min={0}
                  step={10000}
                  style={{ width: '100%' }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/,/g, '') as unknown as 0}
                />
                <Input suffix="VND" style={{ width: 60 }} disabled />
              </Space.Compact>
            </Form.Item>

            <Form.Item
              name="depositAmount"
              label={VI.service.create.form.depositAmount}
              rules={[{ required: true }]}
              initialValue={0}
            >
              <Space.Compact style={{ width: '100%' }}>
                <InputNumber
                  min={0}
                  step={10000}
                  style={{ width: '100%' }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/,/g, '') as unknown as 0}
                />
                <Input suffix="VND" style={{ width: 60 }} disabled />
              </Space.Compact>
            </Form.Item>

            <Form.Item
              name="minPrice"
              label={VI.service.create.form.minPrice}
              rules={[{ required: true }]}
              initialValue={0}
            >
              <Space.Compact style={{ width: '100%' }}>
                <InputNumber
                  min={0}
                  step={10000}
                  style={{ width: '100%' }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/,/g, '') as unknown as 0}
                />
                <Input suffix="VND" style={{ width: 60 }} disabled />
              </Space.Compact>
            </Form.Item>

            <Form.Item
              name="maxPrice"
              label={VI.service.create.form.maxPrice}
              rules={[{ required: false }]}
              initialValue={0}
            >
              <Space.Compact style={{ width: '100%' }}>
                <InputNumber
                  min={0}
                  step={10000}
                  style={{ width: '100%' }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/,/g, '') as unknown as 0}
                />
                <Input suffix="VND" style={{ width: 60 }} disabled />
              </Space.Compact>
            </Form.Item>
          </div>
        </Form>
      </Card>

      {/* Album Files */}
      <Card title={VI.service.create.form.albumFiles} style={{ borderRadius: 12 }}>
        <Upload
          fileList={files}
          onChange={handleFilesChange}
          beforeUpload={() => false}
          multiple
          listType="picture-card"
          accept="image/*"
        >
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>{VI.service.create.form.uploadButton}</div>
          </div>
        </Upload>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button
          type="primary"
          size="large"
          loading={submitting}
          onClick={handleSubmit}
        >
          {submitting
            ? VI.common.status.loading
            : VI.service.create.button.submit}
        </Button>
      </div>
    </div>
  );
}
