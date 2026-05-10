import { Card, CardContent } from "@/components/ui/card"
import { VI } from "@/shared/i18n/vi"

type AuthMarketingHeroProps = {
  imageSrc: string
  imageAlt: string
}

export function AuthMarketingHero({ imageSrc, imageAlt }: AuthMarketingHeroProps) {
  return (
    <Card className="h-full w-full overflow-hidden rounded-none border-0 shadow-xl">
      <CardContent className="relative h-full p-0">
        <img src={imageSrc} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute left-4 top-4 rounded-2xl bg-white/90 px-3 py-2 text-xs shadow-md">
          <div className="font-semibold text-foreground">{VI.common.appName}</div>
          <div className="text-[11px] text-muted-foreground">{VI.auth.hero.promoLine}</div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 px-4 py-3 text-xs shadow-md">
          <div className="grid grid-cols-3 gap-2 text-center text-muted-foreground">
            <div>
              <div className="text-sm font-semibold text-primary">5K+</div>
              {VI.auth.login.stats.costumes}
            </div>
            <div>
              <div className="text-sm font-semibold text-cosmate-pink">2K+</div>
              {VI.auth.login.stats.users}
            </div>
            <div>
              <div className="text-sm font-semibold text-cosmate-success">500+</div>
              {VI.auth.login.stats.rentals}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
