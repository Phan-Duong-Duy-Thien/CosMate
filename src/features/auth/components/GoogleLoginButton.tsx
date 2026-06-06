import { useEffect, useRef, useState } from "react"
import { Chrome } from "lucide-react"

import { cn } from "@/lib/utils"
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
  const googleButtonRef = useRef<HTMLDivElement | null>(null)
  const [scriptError, setScriptError] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!clientId) {
      return
    }

    let cancelled = false

    void loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) {
          return
        }

        googleButtonRef.current.innerHTML = ""

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response.credential) {
              return
            }
            void onCredential(response.credential)
          },
        })

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          width: 400,
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

  if (scriptError) {
    return <p className="text-center text-sm text-destructive">{VI.auth.login.googleLoadFailed}</p>
  }

  return (
    <div className="relative w-full">
      {/* Visual custom button — purely decorative, sits behind the real Google button */}
      <div
        aria-hidden
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] px-4 py-2.5 font-extrabold text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b] transition",
          !isReady && "opacity-70"
        )}
      >
        <Chrome className="h-4 w-4" />
        {VI.auth.login.continueWithGoogle}
      </div>

      {/* Real Google-rendered button — overlaid on top, fully transparent so user
          clicks it directly. This avoids programmatic .click() which browsers
          can silently block in production. */}
      <div
        ref={googleButtonRef}
        className={cn(
          "absolute inset-0 overflow-hidden opacity-[0.01]",
          disabled && "pointer-events-none"
        )}
        style={{ cursor: "pointer" }}
      />
    </div>
  )
}
