import { Link } from "react-router-dom"

import { AuthLayout } from "../layout/AuthLayout"

export default function StaffRegPage() {
  return (
    <AuthLayout>
      <div className="flex w-full flex-col justify-center gap-4 px-[clamp(24px,4vw,48px)] py-[clamp(24px,4vw,48px)] text-center">
        <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-tight text-[#111827]">
          Event staff registration
        </h1>
        <p className="text-sm text-[#6B7280] sm:text-base">Coming soon.</p>
        <Link
          to="/register"
          className="text-sm font-medium text-[#7C3AED] hover:text-[#6D28D9]"
        >
          Back to role selection
        </Link>
      </div>
    </AuthLayout>
  )
}
