import type { ReactNode } from "react"

type AuthLayoutProps = {
  left?: ReactNode
  children: ReactNode
  variant?: "split" | "single"
}

export function AuthLayout({ left, children, variant = "split" }: AuthLayoutProps) {
  if (variant === "single") {
    return (
      <section className="min-h-dvh w-full overflow-hidden bg-[linear-gradient(135deg,#E9D5FF_0%,#FBCFE8_100%)]">
        <div className="flex min-h-dvh w-full items-center justify-center px-4 py-10">
          {children}
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-dvh w-full overflow-hidden bg-[linear-gradient(135deg,#E9D5FF_0%,#FBCFE8_100%)]">
      <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2">
        <div className="hidden w-full items-center justify-center p-8 lg:flex">
          {left}
        </div>
        <div className="flex w-full min-h-dvh items-stretch justify-center bg-white">
          {children}
        </div>
      </div>
    </section>
  )
}
