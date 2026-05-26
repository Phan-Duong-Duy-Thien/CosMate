/**
 * CreateServiceForm Component
 *
 * Shared service form for PROVIDER_PHOTOGRAPH and PROVIDER_EVENT_STAFF roles.
 * Supports two modes:
 *   - 'create': blank form, creates a new service
 *   - 'edit':  prefills all fields from existing ServiceItem, updates on submit
 *
 * Uses shared Vietnam location hook for area selection.
 * All text via i18n.
 */
import { useState, useEffect, useMemo } from 'react';
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
import type { ServiceType, ServiceItem, ServiceArea } from '../types';
import type { UserAddress } from '@/features/profile/types';
import { useAreaLocations } from '@/shared/hooks/useAreaLocations';
import { useCreateService } from '../hooks/useCreateService';
import { useUpdateService } from '../hooks/useUpdateService';
import { VI } from '@/shared/i18n/vi';
import { getServiceTypeDisplayLabel } from '../utils/serviceTypeDisplay';
import { computeServiceMinPrice } from '../utils/computeServiceMinPrice';
import {
  CREATE_SERVICE_FORM_DEFAULTS,
  serviceToFormValues,
  type ServiceFormValues,
} from '../utils/serviceFormValues';

const { TextArea } = Input;
const { Text } = Typography;

/**
 * Parses an area string from API into structured city/district fields.
 * API format: "Phường Thủ Đức, Thành phố Hồ Chí Minh"
 * Falls back gracefully on invalid or unexpected formats.
 */
function parseAreaString(area: string): { city: string; district: string } {
  if (!area) return { city: '', district: '' };
  const parts = area.split(',').map((p) => p.trim());
  if (parts.length >= 2) {
    // Last part is the city; first is the district/ward
    return { city: parts[parts.length - 1], district: parts[0] };
  }
  return { city: area.trim(), district: area.trim() };
}

interface ServiceFormProps {
  /** 'create' or 'edit' */
  mode: 'create' | 'edit';
  serviceType: ServiceType;
  providerId: number;
  shopAddress?: UserAddress | null;
  /** Required when mode === 'edit' */
  editingService?: ServiceItem | null;
  onSuccess?: () => void;
}

export function CreateServiceForm({
  mode,
  serviceType,
  providerId,
  shopAddress,
  editingService,
  onSuccess,
}: ServiceFormProps) {
  const [form] = Form.useForm();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const { submit, submitting } = useCreateService();
  const { update, updating } = useUpdateService();

  const isSubmitting = submitting || updating;

  const {
    selectedProvinceId,
    selectedDistrictId,
    provinces,
    districts,
    isLoadingProvinces,
    isLoadingDistricts,
    setSelectedProvinceId,
    setSelectedDistrictId,
    selectedProvince,
    selectedDistrict,
  } = useAreaLocations();

  const formInitialValues = useMemo((): ServiceFormValues => {
    if (mode === 'edit' && editingService) {
      return serviceToFormValues(editingService);
    }
    return CREATE_SERVICE_FORM_DEFAULTS;
  }, [mode, editingService]);

  const syncMinPriceFromPricingFields = (values: Partial<ServiceFormValues>) => {
    form.setFieldValue(
      'minPrice',
      computeServiceMinPrice(
        values.pricePerSlot,
        values.equipmentDepreciationCost,
        values.depositAmount,
      ),
    );
  };

  const numberRules = (required: boolean) =>
    required
      ? [
          { required: true, message: VI.service.create.validation.required },
          {
            type: 'number' as const,
            min: 0,
            message: VI.service.create.validation.nonNegativeNumber,
          },
        ]
      : [
          {
            type: 'number' as const,
            min: 0,
            message: VI.service.create.validation.nonNegativeNumber,
          },
        ];

  useEffect(() => {
    form.setFieldsValue(formInitialValues);
  }, [form, formInitialValues]);

  // Areas + album when editing
  useEffect(() => {
    if (mode === 'edit' && editingService) {
      const parsedAreas: ServiceArea[] = (editingService.areas ?? []).map((area) => {
        if (typeof area === 'string') return parseAreaString(area);
        return area;
      });
      setAreas(parsedAreas);

      if (parsedAreas.length > 0) {
        const first = parsedAreas[0];
        const matchedProvince = provinces.find((p) => p.name === first.city);
        if (matchedProvince) {
          setSelectedProvinceId(matchedProvince.code);
        }
      }

      setFiles(
        (editingService.imageUrls ?? []).map((url, idx) => ({
          uid: String(idx),
          name: url.split('/').pop() ?? url,
          status: 'done' as const,
          url,
        })),
      );
    } else if (mode === 'create') {
      setAreas([]);
      setFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, editingService?.id]);

  // Auto-select district when districts are loaded in edit mode
  useEffect(() => {
    if (mode !== 'edit' || !editingService || districts.length === 0) return;
    const parsedAreas: ServiceArea[] = (editingService.areas ?? []).map((area) => {
      if (typeof area === 'string') return parseAreaString(area);
      return area;
    });
    if (parsedAreas.length === 0) return;
    const first = parsedAreas[0];
    const matchedDistrict = districts.find((d) => d.name === first.district);
    if (matchedDistrict && selectedDistrictId !== matchedDistrict.code) {
      setSelectedDistrictId(matchedDistrict.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districts]);

  // Prefill service area from shop address only in create mode
  useEffect(() => {
    if (mode !== 'create' || !shopAddress?.city || !shopAddress?.district) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopAddress]);

  const handleAddArea = () => {
    if (!selectedProvince || !selectedDistrict) return;

    const newArea: ServiceArea = {
      city: selectedProvince.name,
      district: selectedDistrict.name,
    };

    const exists = areas.some(
      (a) => a.city === newArea.city && a.district === newArea.district
    );
    if (exists) return;

    setAreas((prev) => [...prev, newArea]);
    setSelectedProvinceId(null);
    setSelectedDistrictId(null);
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

      const formData = {
        serviceName: (values.serviceName ?? '').trim(),
        serviceType,
        providerId,
        description: values.description ?? '',
        slotDurationHours: values.slotDurationHours ?? 1,
        pricePerSlot: values.pricePerSlot ?? 0,
        equipmentDepreciationCost: values.equipmentDepreciationCost ?? 0,
        depositAmount: values.depositAmount ?? 0,
        areas,
        albumFiles,
        minPrice: computeServiceMinPrice(
          values.pricePerSlot,
          values.equipmentDepreciationCost,
          values.depositAmount,
        ),
        maxPrice: values.maxPrice ?? 0,
      };

      let ok = false;
      if (mode === 'create') {
        ok = await submit(formData);
      } else if (mode === 'edit' && editingService) {
        ok = await update(editingService.id, formData);
      }

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
            <Tag color="purple">{getServiceTypeDisplayLabel(serviceType)}</Tag>
          </div>
          <div className="flex items-center gap-3">
            <Text type="secondary">{VI.service.create.form.providerId}:</Text>
            <Text strong>{providerId}</Text>
          </div>
        </Space>
      </Card>

      {/* Location Areas */}
      <Card title={VI.service.create.form.areas} style={{ borderRadius: 12 }}>
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
              value={selectedDistrictId}
              onChange={setSelectedDistrictId}
              disabled={selectedProvinceId === null}
              loading={isLoadingDistricts}
              style={{ minWidth: 200 }}
              options={districts.map((d) => ({
                label: d.name,
                value: d.code,
              }))}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddArea}
              disabled={!selectedProvince || !selectedDistrict}
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
        <Form
          form={form}
          layout="vertical"
          initialValues={formInitialValues}
          onValuesChange={(changed, allValues) => {
            if (
              'pricePerSlot' in changed ||
              'equipmentDepreciationCost' in changed ||
              'depositAmount' in changed
            ) {
              syncMinPriceFromPricingFields(allValues as ServiceFormValues);
            }
          }}
        >
          <Form.Item
            name="serviceName"
            label={VI.service.create.form.serviceName}
            rules={[{ required: true }]}
          >
            <Input
              placeholder={VI.service.create.form.serviceNamePlaceholder}
              showCount
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={VI.service.create.form.description}
            rules={[{ required: true, message: VI.service.create.validation.required }]}
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
              rules={[
                { required: true, message: VI.service.create.validation.required },
                {
                  type: 'number' as const,
                  min: 0.5,
                  message: VI.service.create.validation.positiveNumber,
                },
              ]}
            >
              <InputNumber
                min={0.5}
                step={0.5}
                style={{ width: '100%' }}
                addonAfter="h"
              />
            </Form.Item>

            <Form.Item
              name="pricePerSlot"
              label={VI.service.create.form.pricePerSlot}
              rules={numberRules(true)}
            >
              <InputNumber
                min={0}
                step={10000}
                style={{ width: '100%' }}
                addonAfter="VND"
              />
            </Form.Item>

            <Form.Item
              name="equipmentDepreciationCost"
              label={VI.service.create.form.equipmentDepreciationCost}
              rules={numberRules(false)}
            >
              <InputNumber
                min={0}
                step={10000}
                style={{ width: '100%' }}
                addonAfter="VND"
              />
            </Form.Item>

            <Form.Item
              name="depositAmount"
              label={VI.service.create.form.depositAmount}
              rules={numberRules(true)}
            >
              <InputNumber
                min={0}
                step={10000}
                style={{ width: '100%' }}
                addonAfter="VND"
              />
            </Form.Item>

            <Form.Item
              name="minPrice"
              label={VI.service.create.form.minPrice}
              extra={VI.service.create.form.minPriceAutoHint}
              rules={numberRules(true)}
            >
              <InputNumber
                min={0}
                step={10000}
                style={{ width: '100%' }}
                addonAfter="VND"
                readOnly
                disabled
              />
            </Form.Item>

            <Form.Item
              name="maxPrice"
              label={VI.service.create.form.maxPrice}
              extra={VI.service.create.form.maxPriceHint}
              rules={numberRules(false)}
            >
              <InputNumber
                min={0}
                step={10000}
                style={{ width: '100%' }}
                addonAfter="VND"
              />
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
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting
            ? VI.common.status.loading
            : mode === 'create'
            ? VI.service.create.button.submit
            : (VI.service.edit?.button?.submit ?? VI.service.create.button.submit)}
        </Button>
      </div>
    </div>
  );
}
