import { useCallback, useEffect, useRef, useState } from "react"
import { Chrome } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"

type GoogleLoginButtonProps = {
  clientId: string
  disabled?: boolean
  onCredential: (idToken: string) => void | Promise<void>
}

type GoogleCredentialResponse = {
  credential?: string
}

type GoogleAccounts = {
  id: {
    initialize: (config: {
      client_id: string
      callback: (response: GoogleCredentialResponse) => void
    }) => void
    renderButton: (
      parent: HTMLElement,
      options: {
        type?: "standard"
        theme?: "outline" | "filled_blue" | "filled_black"
        size?: "large" | "medium" | "small"
        text?: "signin_with" | "signup_with" | "continue_with" | "signin"
        shape?: "rectangular" | "pill" | "circle" | "square"
        width?: number
      }
    ) => void
  }
}

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts
    }
  }
}

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client"

function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.id) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_SCRIPT_SRC}"]`)
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true })
      existingScript.addEventListener("error", () => reject(new Error("load_google_script_failed")), { once: true })
      return
    }

    const script = document.createElement("script")
    script.src = GOOGLE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("load_google_script_failed"))
    document.head.appendChild(script)
  })
}

export function GoogleLoginButton({ clientId, disabled, onCredential }: GoogleLoginButtonProps) {
  const hiddenButtonRef = useRef<HTMLDivElement | null>(null)
  const [scriptError, setScriptError] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!clientId) {
      return
    }

    let cancelled = false

    void loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !hiddenButtonRef.current || !window.google?.accounts?.id) {
          return
        }

        hiddenButtonRef.current.innerHTML = ""

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response.credential) {
              return
            }
            void onCredential(response.credential)
          },
        })

        window.google.accounts.id.renderButton(hiddenButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "medium",
          text: "continue_with",
          width: 240,
          shape: "rectangular",
        })
        setIsReady(true)
      })
      .catch(() => {
        if (!cancelled) {
          setScriptError(true)
          setIsReady(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [clientId, onCredential])

  const triggerGoogleLogin = useCallback(() => {
    const trigger = hiddenButtonRef.current?.querySelector<HTMLElement>('div[role="button"], button')
    trigger?.click()
  }, [])

  if (scriptError) {
    return <p className="text-center text-sm text-destructive">{VI.auth.login.googleLoadFailed}</p>
  }

  return (
    <>
      <Button
        type="button"
        variant="soft"
        size="lg"
        disabled={disabled || !isReady}
        onClick={triggerGoogleLogin}
        className={cn(
          "w-full rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] font-extrabold text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] transition hover:-translate-y-0.5 hover:bg-pink-100/70 hover:shadow-[7px_7px_0_0_#1e1b4b] focus-visible:ring-4 focus-visible:ring-pink-300 active:translate-y-0 active:shadow-[3px_3px_0_0_#1e1b4b]",
          !isReady && "opacity-70"
        )}
      >
        <Chrome className="h-4 w-4" aria-hidden />
        {VI.auth.login.continueWithGoogle}
      </Button>

      <div
        ref={hiddenButtonRef}
        className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0"
        aria-hidden
      />
    </>
  )
}
