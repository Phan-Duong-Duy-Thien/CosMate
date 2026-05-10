import * as React from "react"
import { Sparkles } from "lucide-react"
import { useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"

import {
  GUIDELINES_RULES_SECTIONS,
  type GuidelinesRuleItem,
  type GuidelinesSection,
} from "../constants/guidelinesRulesContent"

type ContentView = "guide" | "rules"

function getI18nValue(path: string): string {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== "object" || !(part in acc)) {
      return path
    }
    return (acc as Record<string, unknown>)[part]
  }, VI) as string
}

const SECTION_ID_FROM_TYPE: Record<string, string> = {
  rental: "cosplay-rental",
  photographer: "photographer",
  staff: "staff",
  refund: "orders-returns",
  dispute: "complaints-disputes",
}

export default function GuidelinesRulesPage() {
  const [searchParams] = useSearchParams()
  const typeParam = searchParams.get("type")
  const viewParam = searchParams.get("view")

  const [activeSectionId, setActiveSectionId] = React.useState(
    typeParam ? (SECTION_ID_FROM_TYPE[typeParam] ?? GUIDELINES_RULES_SECTIONS[0]?.id) : GUIDELINES_RULES_SECTIONS[0]?.id
  )
  const [activeView, setActiveView] = React.useState<ContentView>(
    viewParam === "rules" || viewParam === "guide" ? viewParam : "guide"
  )

  React.useEffect(() => {
    if (typeParam && SECTION_ID_FROM_TYPE[typeParam]) {
      setActiveSectionId(SECTION_ID_FROM_TYPE[typeParam])
    }
  }, [typeParam])

  React.useEffect(() => {
    if (viewParam === "rules" || viewParam === "guide") {
      setActiveView(viewParam)
    }
  }, [viewParam])

  const [pageVisible, setPageVisible] = React.useState(false)
  const [contentVisible, setContentVisible] = React.useState(true)

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setPageVisible(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  React.useEffect(() => {
    setContentVisible(false)
    const frame = window.requestAnimationFrame(() => {
      setContentVisible(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [activeSectionId, activeView])

  const activeSection =
    GUIDELINES_RULES_SECTIONS.find((section) => section.id === activeSectionId) ??
    GUIDELINES_RULES_SECTIONS[0]

  const tabButtons: Array<{ key: ContentView; label: string }> = [
    { key: "guide", label: VI.general.guidelinesRules.tabs.guide },
    { key: "rules", label: VI.general.guidelinesRules.tabs.rules },
  ]

  return (
    <section className="min-h-screen bg-gradient-to-b from-cosmate-soft-pink/45 via-background to-background py-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Card
          className={cn(
            "rounded-2xl border-cosmate-lavender-border bg-card/95 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out",
            pageVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}
        >
          <CardContent className="space-y-8 p-6 md:p-8">
            <header className="space-y-4 text-center md:space-y-5">
              <h1 className="text-balance bg-gradient-to-r from-cosmate-pink via-cosmate-mauve to-cosmate-pink bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
                {VI.general.guidelinesRules.pageTitle}
              </h1>
              <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {VI.general.guidelinesRules.pageSubtitle}
              </p>
            </header>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {GUIDELINES_RULES_SECTIONS.map((section) => {
                const selected = section.id === activeSection.id

                return (
                  <button
                    key={section.id}
                    type="button"
                    className={cn(
                      "group relative rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.98] xl:min-h-32",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      selected
                        ? "border-cosmate-pink bg-cosmate-soft-pink/55 shadow-md ring-1 ring-cosmate-pink/20"
                        : "border-cosmate-lavender-border bg-card hover:border-cosmate-pink/40 hover:bg-cosmate-soft-pink/30"
                    )}
                    onClick={() => {
                      setActiveSectionId(section.id)
                      setActiveView("guide")
                    }}
                  >
                    <Sparkles
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute right-3 top-3 h-4 w-4 text-cosmate-pink/80 transition-transform duration-200 motion-safe:animate-pulse",
                        "group-hover:scale-110 group-hover:text-cosmate-pink"
                      )}
                    />
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {VI.general.guidelinesRules.cardSmallTitle}
                    </p>
                    <h2 className="text-lg font-semibold leading-snug tracking-tight text-foreground md:text-xl">
                      {getI18nValue(section.cardMainKey)}
                    </h2>
                  </button>
                )
              })}
            </div>

            <Card className="border-cosmate-lavender-border bg-cosmate-soft-pink/15 shadow-sm">
              <CardContent className="space-y-4 p-4 md:p-6">
                <div className="flex flex-wrap gap-2">
                  {tabButtons.map((tab) => (
                    <Button
                      key={tab.key}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-full border-cosmate-lavender-border px-5",
                        activeView === tab.key
                          ? "border-cosmate-pink bg-cosmate-pink text-primary-foreground shadow-sm hover:bg-cosmate-pink/90 hover:text-primary-foreground"
                          : "bg-card/80 hover:border-cosmate-pink/35 hover:bg-cosmate-soft-pink/40"
                      )}
                      onClick={() => setActiveView(tab.key)}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>

                <div
                  className={cn(
                    "transition-all duration-200 ease-out",
                    contentVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                  )}
                >
                  {activeView === "guide" ? (
                    <GuideList section={activeSection} />
                  ) : (
                    <RulesList section={activeSection} />
                  )}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function GuideList({ section }: { section: GuidelinesSection }) {
  const title =
    section.id === "cosplay-rental"
      ? VI.general.guidelinesRules.cosplayGuideTitle
      : section.id === "photographer"
        ? VI.general.guidelinesRules.photographerGuideTitle
        : section.id === "staff"
          ? VI.general.guidelinesRules.staffGuideTitle
          : section.id === "orders-returns"
            ? VI.general.guidelinesRules.ordersReturnsGuideTitle
            : section.id === "complaints-disputes"
              ? VI.general.guidelinesRules.complaintsGuideTitle
              : `${VI.general.guidelinesRules.tabs.guide} ${getI18nValue(section.titleKey)}`

  return (
    <Card className="mt-1 border-cosmate-lavender-border bg-cosmate-soft-pink/25">
      <CardContent className="space-y-3 p-4 md:p-5">
        <h3 className="text-lg font-semibold leading-snug text-cosmate-pink md:text-xl">{title}</h3>
        <ul className="space-y-2.5">
          {section.guides.map((stepKey, index) => (
            <li key={stepKey} className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground">
              <span
                className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cosmate-pink"
                aria-hidden
              />
              <p className="text-foreground/90">
                <span className="font-semibold text-cosmate-pink">
                  {VI.general.guidelinesRules.stepLabel} {index + 1}
                </span>
                {": "}
                <span className="text-muted-foreground">{getI18nValue(stepKey)}</span>
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function RulesList({ section }: { section: GuidelinesSection }) {
  if (section.ruleGroups?.length) {
    return <CosplayRulesLayout section={section} />
  }

  return (
    <div className="mt-1 space-y-3">
      {section.rules.map((rule) => (
        <Card key={`${section.id}-${rule.code}`} className="border-cosmate-lavender-border bg-cosmate-soft-pink/15">
          <CardContent className="p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-cosmate-pink">
              {VI.general.guidelinesRules.rulePrefix} {rule.code}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">{getI18nValue(rule.titleKey)}</h3>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">{getI18nValue(rule.descKey)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CosplayRulesLayout({ section }: { section: GuidelinesSection }) {
  const ruleGroups = section.ruleGroups ?? []
  const [activeGroupId, setActiveGroupId] = React.useState(ruleGroups[0]?.id ?? "")
  const mainTitle =
    section.id === "photographer"
      ? VI.general.guidelinesRules.photographerRulesTitle
      : section.id === "staff"
        ? VI.general.guidelinesRules.staffRulesTitle
        : section.id === "orders-returns"
          ? VI.general.guidelinesRules.ordersReturnsRulesTitle
          : section.id === "complaints-disputes"
            ? VI.general.guidelinesRules.complaintsRulesTitle
            : VI.general.guidelinesRules.cosplayRules.mainTitle
  const mainDescription =
    section.id === "staff"
      ? VI.general.guidelinesRules.staffRules.mainDescription
      : section.id === "photographer"
        ? VI.general.guidelinesRules.photographerRules.mainDescription
        : section.id === "orders-returns"
          ? VI.general.guidelinesRules.ordersReturnsRules.mainDescription
          : section.id === "complaints-disputes"
            ? VI.general.guidelinesRules.complaintsRules.mainDescription
            : VI.general.guidelinesRules.cosplayRules.mainDescription
  const heroTitleText =
    section.id === "cosplay-rental"
      ? mainTitle.replace(/^.*?(Nội Quy Thuê Đồ Cosplay).*$/u, "$1")
      : mainTitle

  const ruleByCode = React.useMemo(() => {
    return section.rules.reduce<Record<string, GuidelinesRuleItem>>((acc, rule) => {
      acc[rule.code] = rule
      return acc
    }, {})
  }, [section.rules])

  React.useEffect(() => {
    setActiveGroupId(ruleGroups[0]?.id ?? "")
  }, [ruleGroups])

  return (
    <div className="mt-1 grid gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:items-start">
      <Card className="border-cosmate-lavender-border bg-cosmate-soft-pink/20 lg:sticky lg:top-28 lg:self-start">
        <CardContent className="space-y-3 p-4 md:p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-cosmate-pink md:text-base">
            {VI.general.guidelinesRules.cosplayRules.tocTitle}
          </p>
          <div className="space-y-1.5">
            {ruleGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                className={cn(
                  "block w-full rounded-lg border-l-2 px-3 py-2 text-left text-sm leading-relaxed transition-colors md:text-base",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  activeGroupId === group.id
                    ? "border-cosmate-pink bg-cosmate-soft-pink/50 font-medium text-foreground shadow-sm"
                    : "border-transparent text-muted-foreground hover:border-cosmate-pink/25 hover:bg-cosmate-soft-pink/30 hover:text-foreground"
                )}
                aria-current={activeGroupId === group.id ? "true" : undefined}
                onClick={() => {
                  setActiveGroupId(group.id)
                  const element = document.getElementById(`rules-${group.id}`)
                  element?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
              >
                {getI18nValue(group.titleKey)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border-cosmate-pink/25 bg-gradient-to-br from-cosmate-soft-pink/50 via-card to-cosmate-lavender-surface/60">
          <CardContent className="space-y-2 p-4 md:p-5">
            <h3 className="flex flex-wrap items-center gap-2 text-xl font-semibold tracking-tight text-cosmate-pink md:text-2xl">
              <span>{heroTitleText}</span>
              {section.id === "cosplay-rental" ? (
                <Sparkles
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-cosmate-pink/90 motion-safe:animate-pulse md:h-6 md:w-6"
                />
              ) : null}
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">{mainDescription}</p>
            {section.ruleIntroKeys?.length ? (
              <div className="space-y-1.5 text-base leading-relaxed text-muted-foreground">
                {section.ruleIntroKeys.map((introKey) => (
                  <p key={introKey}>{getI18nValue(introKey)}</p>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {ruleGroups.map((group) => (
          <Card
            key={group.id}
            id={`rules-${group.id}`}
            className="scroll-mt-24 border-cosmate-lavender-border bg-card shadow-sm"
          >
            <CardContent className="space-y-3 p-4 md:p-5">
              <h4 className="text-xl font-bold text-cosmate-pink md:text-2xl">{getI18nValue(group.titleKey)}</h4>
              <ul className="space-y-2">
                {group.ruleCodes.map((code) => {
                  const rule = ruleByCode[code]
                  if (!rule) return null

                  return (
                    <li
                      key={`${group.id}-${code}`}
                      className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground"
                    >
                      <span
                        className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cosmate-pink/55"
                        aria-hidden
                      />
                      <p>
                        <span className="font-semibold text-foreground">{getI18nValue(rule.titleKey)}</span>
                        {": "}
                        {getI18nValue(rule.descKey)}
                      </p>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
