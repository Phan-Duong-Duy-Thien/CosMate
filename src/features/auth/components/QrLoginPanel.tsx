import { Button, QRCode, Spin } from "antd"
import { RefreshCw, Smartphone } from "lucide-react"

import { VI } from "@/shared/i18n/vi"
import { cn } from "@/lib/utils"
import { useQrLoginSession } from "../hooks/useQrLoginSession"

type QrLoginPanelProps = {
  active: boolean
  onApproved: (roles: string[]) => void
}

export function QrLoginPanel({ active, onApproved }: QrLoginPanelProps) {
  const {
    qrValue,
    sessionLoading,
    status,
    countdownLabel,
    sessionError,
    refreshSession,
    isWaiting,
    showWaitHint,
  } = useQrLoginSession({ active, onApproved })

  const isExpired = status === "EXPIRED" || status === "CANCELLED"

  return (
    <div className="space-y-5">
      <p className="text-center text-sm font-semibold leading-relaxed text-indigo-950/85">
        {VI.auth.qrLogin.intro}
      </p>

      <ol className="space-y-2 text-sm font-semibold text-indigo-950/90">
        {VI.auth.qrLogin.steps.map((step, index) => (
          <li key={step} className="flex gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-indigo-950 bg-cosmate-soft-pink/50 text-xs font-extrabold">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>

      <div className="flex flex-col items-center gap-3 rounded-2xl border-[3px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[6px_6px_0_0_rgba(30,27,75,0.18)]">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-indigo-900/70">
          <Smartphone className="h-4 w-4 text-cosmate-pink" aria-hidden />
          {VI.auth.qrLogin.scanTitle}
        </div>

        {sessionLoading || !qrValue ? (
          <Spin />
        ) : (
          <div
            className={cn(
              "rounded-xl border-[3px] border-indigo-950 bg-white p-3 shadow-[4px_4px_0_0_rgba(30,27,75,0.15)]",
              isExpired && "opacity-50"
            )}
          >
            <QRCode value={qrValue} size={200} bordered={false} />
          </div>
        )}

        {isWaiting && (
          <p className="text-center text-xs font-bold text-indigo-800/80">
            {VI.auth.qrLogin.waiting(countdownLabel)}
          </p>
        )}

        {showWaitHint && isWaiting && !sessionError && (
          <p className="text-center text-xs font-semibold text-amber-800">
            {VI.auth.qrLogin.waitHint}
          </p>
        )}

        {isExpired && (
          <p className="text-center text-sm font-extrabold text-rose-700">
            {VI.auth.qrLogin.expired}
          </p>
        )}

        {sessionError && (
          <p className="text-center text-sm font-semibold text-destructive">{sessionError}</p>
        )}

        <p className="text-center text-xs font-medium text-indigo-900/60">
          {VI.auth.qrLogin.appLoginHint}
        </p>

        <Button
          type="link"
          size="small"
          icon={<RefreshCw className="h-3.5 w-3.5" />}
          onClick={refreshSession}
          disabled={sessionLoading}
          className="!font-semibold !text-indigo-800"
        >
          {VI.auth.qrLogin.refreshQr}
        </Button>
      </div>
    </div>
  )
}
