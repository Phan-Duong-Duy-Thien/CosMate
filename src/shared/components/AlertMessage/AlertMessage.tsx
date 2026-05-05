import type { ReactNode } from "react"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

export type AlertType = "error" | "success" | "info"

type AlertMessageProps = {
  type: AlertType
  message: string | ReactNode
  className?: string
}

const typeConfig: Record<
  AlertType,
  {
    icon: ReactNode
    wrapper: string
    iconColor: string
  }
> = {
  error: {
    icon: <AlertCircle className="h-4 w-4 shrink-0" />,
    wrapper:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
    iconColor: "text-red-500 dark:text-red-400",
  },
  success: {
    icon: <CheckCircle className="h-4 w-4 shrink-0" />,
    wrapper:
      "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
    iconColor: "text-green-500 dark:text-green-400",
  },
  info: {
    icon: <Info className="h-4 w-4 shrink-0" />,
    wrapper:
      "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
}

export function AlertMessage({ type, message, className = "" }: AlertMessageProps) {
  const config = typeConfig[type]

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-md border px-3 py-2 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${config.wrapper} ${className}`}
    >
      <span className={config.iconColor}>{config.icon}</span>
      <span className="leading-tight">{message}</span>
    </div>
  )
}
