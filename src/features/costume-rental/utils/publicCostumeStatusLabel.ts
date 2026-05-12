import type { CostumeStatus } from "../types"
import { VI } from "@/shared/i18n/vi"

/** Nhãn tiếng Việt cho trạng thái trang phục trên trang công khai. */
export function publicCostumeStatusLabel(status: CostumeStatus): string {
  const t = VI.costumeRental.costumeStatus
  switch (status) {
    case "AVAILABLE":
      return t.available
    case "RENTED":
      return t.rented
    case "MAINTENANCE":
      return t.maintenance
    case "DISABLED":
      return t.disabled
    default:
      return status
  }
}
