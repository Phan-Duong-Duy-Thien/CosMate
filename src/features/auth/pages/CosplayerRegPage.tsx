import registerHero from "@/assets/sakura-card.jpg"
import { VI } from "@/shared/i18n/vi"
import { ROLE } from "@/types/auth"

import { RegisterSplitLayout } from "../components/RegisterSplitLayout"
import { useRegister } from "../hooks/useRegister"

export default function CosplayerRegPage() {
  const { submitting, formError, handleRegister } = useRegister(ROLE.COSPLAYER)

  return (
    <RegisterSplitLayout
      heroImage={registerHero}
      heroAlt="Cosmate registration hero"
      title={VI.auth.register.byRole.cosplayer.title}
      subtitle={VI.auth.register.byRole.cosplayer.subtitle}
      submitting={submitting}
      formError={formError}
      onRegister={handleRegister}
    />
  )
}
