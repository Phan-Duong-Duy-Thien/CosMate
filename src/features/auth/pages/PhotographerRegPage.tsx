import registerHero from "@/assets/sakura-card.jpg"
import { VI } from "@/shared/i18n/vi"
import { ROLE } from "@/types/auth"

import { RegisterSplitLayout } from "../components/RegisterSplitLayout"
import { useRegister } from "../hooks/useRegister"

export default function PhotographerRegPage() {
  const { submitting, formError, handleRegister } = useRegister(ROLE.PROVIDER_PHOTOGRAPH)

  return (
    <RegisterSplitLayout
      heroImage={registerHero}
      heroAlt="Cosmate registration hero"
      title={VI.auth.register.byRole.photographer.title}
      subtitle={VI.auth.register.byRole.photographer.subtitle}
      submitting={submitting}
      formError={formError}
      onRegister={handleRegister}
    />
  )
}
