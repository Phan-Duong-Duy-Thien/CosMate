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

export default function AddressCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

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
              <label className="mb-1 block text-sm font-medium text-foreground">
                {VI.profile.address.form.recipientName}
              </label>
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
              <label className="mb-1 block text-sm font-medium text-foreground">
                {VI.profile.address.form.phone}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={VI.profile.address.form.phonePlaceholder}
                className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35"
              />
            </div>

            {/* Address Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                {VI.profile.address.form.addressName}
              </label>
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
              <label className="mb-1 block text-sm font-medium text-foreground">
                {VI.profile.address.form.city}
              </label>
              <select
                value={provinceCode ?? ''}
                onChange={(e) => setProvinceCode(e.target.value ? Number(e.target.value) : null)}
                disabled={isLoadingProvinces}
                className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35 disabled:opacity-50"
              >
                <option value="">
                  {isLoadingProvinces
                    ? VI.common.status.loading
                    : VI.profile.address.form.cityPlaceholder}
                </option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                {VI.profile.address.form.district}
              </label>
              <select
                value={districtCode ?? ''}
                onChange={(e) => setDistrictCode(e.target.value ? Number(e.target.value) : null)}
                disabled={!provinceCode || isLoadingDistricts}
                className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35 disabled:opacity-50"
              >
                <option value="">
                  {isLoadingDistricts
                    ? VI.common.status.loading
                    : provinceCode
                      ? VI.profile.address.form.districtPlaceholder
                      : VI.profile.address.form.cityPlaceholder}
                </option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Street Address */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                {VI.profile.address.form.streetAddress}
              </label>
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
