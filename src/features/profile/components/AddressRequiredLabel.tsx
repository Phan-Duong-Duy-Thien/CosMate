import { cn } from "@/lib/utils"

interface AddressRequiredLabelProps {
  children: React.ReactNode
  className?: string
  requiredClassName?: string
}

export function AddressRequiredLabel({
  children,
  className,
  requiredClassName = "text-[#d61f91]",
}: AddressRequiredLabelProps) {
  return (
    <label className={className}>
      {children} <span className={requiredClassName}>*</span>
    </label>
  )
}

export function AddressOptionalLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <label className={cn(className)}>{children}</label>
}
