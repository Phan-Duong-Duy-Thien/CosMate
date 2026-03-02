import { useState } from "react"
import { useUserProfile } from "../hooks/useUserProfile"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"
import { EditProfileModal } from "../components/EditProfileModal"

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-700",
  banned: "bg-rose-100 text-rose-700",
  default: "bg-purple-100 text-purple-700",
}

export default function CosplayerProfilePage() {
  const { profile, displayName, handle, initials, statusTone, loading, error, setProfile } =
    useUserProfile()
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#fff6fc] via-[#f6f5ff] to-[#eef7ff] px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-7 shadow-[0_12px_40px_rgba(180,160,255,0.18)] backdrop-blur-sm sm:p-8">
          {loading ? (
            <div className="space-y-4">
              <div className="mx-auto h-28 w-28 animate-pulse rounded-full bg-slate-200" />
              <div className="mx-auto h-5 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mx-auto h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="mt-6 grid gap-3">
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-center text-2xl font-bold text-slate-900">
                {VI.profile.title}
              </h1>
              {profile && (
                <div className="mt-3 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditOpen(true)}
                  >
                    {VI.profile.edit}
                  </Button>
                </div>
              )}
              {error ? (
                <p className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-center text-sm text-rose-700">
                  {error}
                </p>
              ) : profile ? (
                <div className="mt-6">
                  <div className="flex flex-col items-center">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={displayName}
                        className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                      />
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-purple-100 text-3xl font-bold text-purple-700 shadow-md">
                        {initials}
                      </div>
                    )}
                    <h2 className="mt-4 text-xl font-semibold text-slate-900">
                      {displayName}
                    </h2>
                    <p className="text-sm text-purple-600">{handle}</p>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-medium text-slate-500">
                        {VI.admin.users.columns.email}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {profile.email}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-medium text-slate-500">
                        {VI.admin.users.columns.phone}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {profile.phone}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-medium text-slate-500">
                        {VI.admin.users.columns.status}
                      </p>
                      <div className="mt-1">
                        <Badge className={STATUS_BADGE_CLASS[statusTone]}>
                          {profile.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
                  {VI.common.status.noData}
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <EditProfileModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        profile={profile}
        onProfileUpdated={setProfile}
      />
    </div>
  )
}
