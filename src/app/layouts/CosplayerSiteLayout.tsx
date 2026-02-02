import { Outlet } from "react-router-dom"

export default function CosplayerSiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] text-[#111827]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <div className="text-lg font-semibold">CosMate</div>
          <div className="text-sm text-[#6B7280]">Header Placeholder</div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 text-sm text-[#6B7280]">
          <span>© 2026 CosMate</span>
          <span>Footer Placeholder</span>
        </div>
      </footer>
    </div>
  )
}
