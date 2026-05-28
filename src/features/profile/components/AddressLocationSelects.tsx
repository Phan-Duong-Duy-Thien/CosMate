import { Select } from "antd"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import type { District, Province } from "../types"

const SELECT_WRAPPER = {
  page: "[&_.ant-select-selector]:!min-h-[42px] [&_.ant-select-selector]:!rounded-full [&_.ant-select-selector]:!border-border [&_.ant-select-selector]:!bg-background [&_.ant-select-selector]:!px-2 [&_.ant-select-selector]:!shadow-none",
  modal:
    "[&_.ant-select-selector]:!h-10 [&_.ant-select-selector]:!rounded-full [&_.ant-select-selector]:!border-2 [&_.ant-select-selector]:!border-indigo-950/35 [&_.ant-select-selector]:!bg-white [&_.ant-select-selector]:!px-2 [&_.ant-select-selector]:!shadow-sm",
} as const

const SELECT_ERROR =
  "[&_.ant-select-selector]:!border-destructive focus-within:[&_.ant-select-selector]:!ring-destructive/35"

type LocationSelectVariant = keyof typeof SELECT_WRAPPER

interface ProvinceSelectProps {
  variant?: LocationSelectVariant
  provinceCode: number | null
  provinces: Province[]
  loading: boolean
  hasError?: boolean
  onProvinceChange: (code: number | null, province: Province | undefined) => void
}

export function ProvinceSelect({
  variant = "page",
  provinceCode,
  provinces,
  loading,
  hasError,
  onProvinceChange,
}: ProvinceSelectProps) {
  return (
    <div className={cn("w-full", SELECT_WRAPPER[variant], hasError && SELECT_ERROR)}>
      <Select
        showSearch
        allowClear
        optionFilterProp="label"
        placeholder={
          loading ? VI.common.status.loading : VI.profile.address.form.cityPlaceholder
        }
        searchPlaceholder={VI.profile.address.form.citySearchPlaceholder}
        value={provinceCode ?? undefined}
        onChange={(value) => {
          const code = value == null ? null : Number(value)
          const province = provinces.find((item) => item.code === code)
          onProvinceChange(code, province)
        }}
        disabled={loading}
        className="w-full"
        options={provinces.map((province) => ({
          value: province.code,
          label: province.name,
        }))}
      />
    </div>
  )
}

interface DistrictSelectProps {
  variant?: LocationSelectVariant
  provinceCode: number | null
  districtCode: number | null
  districts: District[]
  loading: boolean
  hasError?: boolean
  onDistrictChange: (code: number | null, district: District | undefined) => void
}

export function DistrictSelect({
  variant = "page",
  provinceCode,
  districtCode,
  districts,
  loading,
  hasError,
  onDistrictChange,
}: DistrictSelectProps) {
  const disabled = provinceCode == null || loading

  return (
    <div className={cn("w-full", SELECT_WRAPPER[variant], hasError && SELECT_ERROR)}>
      <Select
        showSearch
        allowClear
        optionFilterProp="label"
        placeholder={
          loading
            ? VI.common.status.loading
            : provinceCode == null
              ? VI.profile.address.form.cityPlaceholder
              : VI.profile.address.form.districtPlaceholder
        }
        searchPlaceholder={VI.profile.address.form.districtSearchPlaceholder}
        value={districtCode ?? undefined}
        onChange={(value) => {
          const code = value == null ? null : Number(value)
          const district = districts.find((item) => item.code === code)
          onDistrictChange(code, district)
        }}
        disabled={disabled}
        className="w-full"
        options={districts.map((district) => ({
          value: district.code,
          label: district.name,
        }))}
      />
    </div>
  )
}
