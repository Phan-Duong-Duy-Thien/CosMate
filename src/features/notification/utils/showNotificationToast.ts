import * as React from "react"
import { Button, notification } from "antd"
import { VI } from "@/shared/i18n/vi"
import type { NotificationItem } from "../types"
import { formatNotificationDisplayText } from "./formatNotificationDisplayText"

const DESC_MAX = 1200

function buildDescription(text: string): string {
  const t = text.trim()
  if (t.length <= DESC_MAX) return t
  return `${t.slice(0, DESC_MAX)}…`
}

/**
 * Shows full notification in an Ant Design notification (toast).
 * Optional "Xem chi tiết" only follows link when user clicks the button.
 */
export function showNotificationDetailToast(
  item: NotificationItem,
  options?: { onViewLink?: () => void }
): void {
  const key = `notification-detail-${item.id}`
  const hasLink = Boolean(item.link?.trim())

  notification.open({
    key,
    type: "info",
    message: formatNotificationDisplayText(item.header),
    description: buildDescription(formatNotificationDisplayText(item.content || "")),
    duration: 8,
    placement: "topRight",
    style: { maxWidth: 420 },
    btn: hasLink
      ? React.createElement(
          Button,
          {
            type: "primary",
            size: "small",
            onClick: () => {
              notification.destroy(key)
              options?.onViewLink?.()
            },
          },
          VI.notification.toastViewLink
        )
      : undefined,
  })
}

export function showNotificationActionToast(kind: "readAll" | "delete", ok: boolean): void {
  if (ok) {
    notification.success({
      message:
        kind === "readAll"
          ? VI.notification.toastMarkedAllRead
          : VI.notification.toastDeleted,
      duration: 3,
      placement: "topRight",
    })
  } else {
    notification.error({
      message:
        kind === "readAll"
          ? VI.notification.toastMarkAllReadFailed
          : VI.notification.toastDeleteFailed,
      duration: 4,
      placement: "topRight",
    })
  }
}
