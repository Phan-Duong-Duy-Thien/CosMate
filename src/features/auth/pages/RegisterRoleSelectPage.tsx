import { ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { AuthLayout } from "../layout/AuthLayout"

type RoleOption = {
  title: string
  description: string
  path: string
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    title: "Cosplayer",
    description: "Create a cosplay profile and rent costumes.",
    path: "/register/cosplayer",
  },
  {
    title: "Provider",
    description: "List costumes and manage rentals.",
    path: "/register/provider",
  },
  {
    title: "Event Staff",
    description: "Support events and manage staffing.",
    path: "/register/staff",
  },
  {
    title: "Photographer",
    description: "Offer photo services to cosplayers.",
    path: "/register/photographer",
  },
]

export default function RegisterRoleSelectPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout variant="single">
      <div className="w-full max-w-4xl rounded-3xl border border-white/40 bg-white/85 p-[clamp(20px,4vw,40px)] shadow-2xl">
        <div className="flex w-full flex-col gap-[clamp(16px,2vw,24px)]">
          <div className="space-y-2 text-center">
            <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold leading-tight text-[#111827]">
              Choose your role
            </h1>
            <p className="text-sm text-[#6B7280] sm:text-base">
              Select the account type you want to create
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.title}
                type="button"
                onClick={() => navigate(option.path)}
                className="group text-left"
              >
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition group-hover:shadow-md">
                  <div className="space-y-1">
                    <div className="text-base font-semibold text-[#111827]">
                      {option.title}
                    </div>
                    <div className="text-sm text-[#6B7280]">{option.description}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#9CA3AF]" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
