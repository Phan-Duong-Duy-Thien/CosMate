import { VI } from "@/shared/i18n/vi"

type AuthMarketingHeroProps = {
  imageSrc: string
  imageAlt: string
}

export function AuthMarketingHero({ imageSrc, imageAlt }: AuthMarketingHeroProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img src={imageSrc} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute left-4 top-4 rounded-2xl border-[3px] border-indigo-950/80 bg-[#fffbeb]/95 px-3 py-2 text-xs shadow-[5px_5px_0_0_rgba(30,27,75,0.35)]">
        <div className="font-extrabold text-indigo-950">{VI.common.appName}</div>
        <div className="text-[11px] font-semibold text-indigo-900/80">{VI.auth.hero.promoLine}</div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 rounded-2xl border-[3px] border-indigo-950/80 bg-[#fffbeb]/95 px-4 py-3 text-xs shadow-[6px_6px_0_0_rgba(30,27,75,0.4)]">
        <div className="grid grid-cols-3 gap-2 text-center font-semibold text-indigo-900/85">
          <div>
            <div className="text-sm font-extrabold text-fuchsia-600">5K+</div>
            {VI.auth.login.stats.costumes}
          </div>
          <div>
            <div className="text-sm font-extrabold text-pink-600">2K+</div>
            {VI.auth.login.stats.users}
          </div>
          <div>
            <div className="text-sm font-extrabold text-emerald-600">500+</div>
            {VI.auth.login.stats.rentals}
          </div>
        </div>
      </div>
    </div>
  )
}
