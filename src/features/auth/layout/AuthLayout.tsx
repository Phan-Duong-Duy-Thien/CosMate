import type { ReactNode } from "react"

type AuthLayoutProps = {
  left?: ReactNode
  children: ReactNode
}

export function AuthLayout({ left, children }: AuthLayoutProps) {
  return (
    <section className="min-h-dvh w-full overflow-x-hidden bg-[linear-gradient(135deg,#E9D5FF_0%,#FBCFE8_100%)] px-4 py-10 lg:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-0 md:px-4">
        <div className="overflow-hidden rounded-3xl bg-white/70 shadow-2xl">
          <div className="grid min-h-[560px] w-full grid-cols-1 lg:grid-cols-2">
            <div className="hidden w-full items-center justify-center p-8 lg:flex">
              {left}
            </div>
            <div className="flex w-full items-stretch justify-center px-6 py-10 sm:px-10 lg:px-12">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
