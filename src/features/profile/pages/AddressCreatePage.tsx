/**
 * Address Create Page
 * Allows users to add a new address for rental checkout
 */
import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { VI } from '@/shared/i18n/vi';
import { useCreateAddress } from '../hooks/useCreateAddress';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { AddressRequiredLabel, AddressOptionalLabel } from '../components/AddressRequiredLabel';
import { DistrictSelect, ProvinceSelect } from '../components/AddressLocationSelects';
import { AddressPhoneInput } from '../components/AddressPhoneInput';
import { getPhoneValidationError } from '../utils/addressValidation';

export default function AddressCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';
  const [phoneError, setPhoneError] = React.useState<string | undefined>();

  const {
    name,
    phone,
    provinceCode,
    districtCode,
    streetAddress,
    addressName,
    provinces,
    districts,
    isLoadingProvinces,
    isLoadingDistricts,
    isSubmitting,
    setName,
    setPhone,
    setProvinceCode,
    setDistrictCode,
    setStreetAddress,
    setAddressName,
    submit,
  } = useCreateAddress();

  // Get selected province and district names for submission
  const selectedProvince = useMemo(
    () => provinces.find((p) => p.code === provinceCode),
    [provinces, provinceCode]
  );

  const selectedDistrict = useMemo(
    () => districts.find((d) => d.code === districtCode),
    [districts, districtCode]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = getUserId();
    if (!userId) {
      // Redirect to login if not authenticated
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }

    const provinceName = selectedProvince?.name || '';
    const districtName = selectedDistrict?.name || '';

    const phoneValidationError = getPhoneValidationError(phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    const success = await submit(userId, provinceName, districtName);
    if (success) {
      navigate(returnTo);
    }
  };

  const handleBack = () => {
    navigate(returnTo);
  };

  return (
    <section className="home-anime min-h-[calc(100vh-64px)] bg-transparent px-3 py-8 md:px-4 md:py-10">
      <div className="mx-auto w-full max-w-2xl px-4 pt-10">
        <Card className="rounded-3xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[10px_10px_0_0_rgba(30,27,75,0.38)]">
          <div className="p-6">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              {VI.profile.address.createPage.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {VI.profile.address.createPage.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (recipient) */}
            <div>
              <AddressRequiredLabel className="mb-1 block text-sm font-medium text-foreground">
                {VI.profile.address.form.recipientName}
              </AddressRequiredLabel>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={VI.profile.address.form.recipientNamePlaceholder}
                className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35"
              />
            </div>

            {/* Phone */}
            <div>
              <AddressRequiredLabel className="mb-1 block text-sm font-medium text-foreground">
                {VI.profile.address.form.phone}
              </AddressRequiredLabel>
              <AddressPhoneInput
                value={phone}
                onChange={(value) => {
                  setPhone(value);
                  if (phoneError) setPhoneError(getPhoneValidationError(value));
                }}
                onBlur={() => setPhoneError(getPhoneValidationError(phone))}
                hasError={Boolean(phoneError)}
                className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35"
              />
              {phoneError && (
                <p className="mt-1 text-xs font-medium text-destructive">{phoneError}</p>
              )}
            </div>

            {/* Address Name */}
            <div>
              <AddressOptionalLabel className="mb-1 block text-sm font-medium text-foreground">
                {VI.profile.address.form.addressName}
              </AddressOptionalLabel>
              <input
                type="text"
                value={addressName}
                onChange={(e) => setAddressName(e.target.value)}
                placeholder={VI.profile.address.form.addressNamePlaceholder}
                className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35"
              />
            </div>

            {/* City/Province */}
            <div>
              <AddressRequiredLabel className="mb-1 block text-sm font-medium text-foreground">
                {VI.profile.address.form.city}
              </AddressRequiredLabel>
              <ProvinceSelect
                provinceCode={provinceCode}
                provinces={provinces}
                loading={isLoadingProvinces}
                onProvinceChange={(code) => {
                  setProvinceCode(code)
                  if (code == null) setDistrictCode(null)
                }}
              />
            </div>

            {/* District */}
            <div>
              <AddressRequiredLabel className="mb-1 block text-sm font-medium text-foreground">
                {VI.profile.address.form.district}
              </AddressRequiredLabel>
              <DistrictSelect
                provinceCode={provinceCode}
                districtCode={districtCode}
                districts={districts}
                loading={isLoadingDistricts}
                onDistrictChange={(code) => setDistrictCode(code)}
              />
            </div>

            {/* Street Address */}
            <div>
              <AddressRequiredLabel className="mb-1 block text-sm font-medium text-foreground">
                {VI.profile.address.form.streetAddress}
              </AddressRequiredLabel>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder={VI.profile.address.form.streetAddressPlaceholder}
                className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 rounded-full"
                onClick={handleBack}
              >
                {VI.profile.address.button.back}
              </Button>
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="flex-1 rounded-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? VI.common.status.loading : VI.profile.address.button.save}
              </Button>
            </div>
          </form>
          </div>
        </Card>
      </div>
    </section>
  );
}
