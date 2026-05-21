import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import { sanitizePhoneInput } from "../utils/addressValidation"

interface AddressPhoneInputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  hasError?: boolean
  className?: string
}

export function AddressPhoneInput({
  value,
  onChange,
  onBlur,
  hasError,
  className,
}: AddressPhoneInputProps) {
  return (
    <input
      type="tel"
      inputMode="numeric"
      maxLength={10}
      value={value}
      onChange={(e) => onChange(sanitizePhoneInput(e.target.value))}
      onBlur={onBlur}
      placeholder={VI.profile.address.form.phonePlaceholder}
      className={cn(className, hasError && "!border-destructive focus-visible:!ring-destructive/35")}
    />
  )
}
