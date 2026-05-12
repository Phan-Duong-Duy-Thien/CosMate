import * as React from "react"
import { BookOpen, Sparkles } from "lucide-react"
import { useSearchParams } from "react-router-dom"

import { Card } from "@/shared/components/Card"
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

const stickerTabActive =
  "border-[3px] border-indigo-950 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-[5px_5px_0_0_#1e1b4b] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#1e1b4b] active:translate-y-0 active:shadow-[3px_3px_0_0_#1e1b4b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 motion-safe:hover:-translate-y-0.5"

const stickerTabInactive =
  "border-[3px] border-indigo-950 rounded-full bg-[#fffbeb] px-5 py-2.5 text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] transition-all duration-200 hover:bg-pink-100 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#1e1b4b] active:translate-y-0 active:shadow-[3px_3px_0_0_#1e1b4b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 motion-safe:hover:-translate-y-0.5"

const sectionCardBase =
  "group relative rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] p-4 text-left shadow-[8px_8px_0_0_rgba(30,27,75,0.55)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[12px_12px_0_0_rgba(236,72,153,0.45)] active:scale-[0.99] xl:min-h-32"

const sectionCardSelected =
  "bg-gradient-to-br from-pink-100 via-[#fffbeb] to-fuchsia-50 shadow-[10px_10px_0_0_rgba(168,85,247,0.35)] motion-safe:hover:shadow-[12px_12px_0_0_rgba(236,72,153,0.45)]"

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
    <section className="min-h-screen bg-transparent py-8 font-sans md:py-10">
      <div className="mx-auto w-full max-w-none">
        <Card
          className={cn(
            "rounded-3xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[8px_8px_0_0_rgba(30,27,75,0.55)] transition-all duration-300 ease-out",
            pageVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}
        >
          <div className="space-y-8 p-6 md:p-8">
            <header className="flex flex-col items-center gap-5 text-center">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-gradient-to-br from-amber-300 via-orange-400 to-pink-400 text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b]">
                  <BookOpen className="h-5 w-5" aria-hidden />
                </span>
                <h1 className="max-w-4xl text-balance text-[1.35rem] font-extrabold leading-tight tracking-tight text-indigo-950 md:text-2xl lg:text-3xl">
                  <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    {VI.general.guidelinesRules.pageTitle}
                  </span>
                </h1>
              </div>
              <p className="max-w-2xl text-pretty rounded-2xl border-[3px] border-indigo-950 bg-[#fffbeb] px-4 py-3 text-sm font-semibold leading-relaxed text-indigo-950 shadow-[6px_6px_0_0_rgba(30,27,75,0.75)] md:text-base">
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
                    className={cn(sectionCardBase, selected && sectionCardSelected)}
                    onClick={() => {
                      setActiveSectionId(section.id)
                      setActiveView("guide")
                    }}
                  >
                    <Sparkles
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute right-3 top-3 h-4 w-4 text-indigo-950/70 transition-transform duration-200 motion-safe:group-hover:scale-110",
                        selected && "text-fuchsia-600"
                      )}
                    />
                    <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-indigo-950/70">
                      {VI.general.guidelinesRules.cardSmallTitle}
                    </p>
                    <h2 className="text-lg font-extrabold leading-snug tracking-tight text-indigo-950 md:text-xl">
                      {getI18nValue(section.cardMainKey)}
                    </h2>
                  </button>
                )
              })}
            </div>

            <Card className="rounded-3xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[8px_8px_0_0_rgba(30,27,75,0.55)]">
              <div className="space-y-4 p-4 md:p-6">
                <div className="flex flex-wrap gap-2">
                  {tabButtons.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      className={cn(activeView === tab.key ? stickerTabActive : stickerTabInactive)}
                      onClick={() => setActiveView(tab.key)}
                    >
                      {tab.label}
                    </button>
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
              </div>
            </Card>
          </div>
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
    <Card className="mt-1 rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[6px_6px_0_0_rgba(30,27,75,0.55)]">
      <div className="space-y-4 p-4 md:p-5">
        <h3 className="text-lg font-extrabold leading-snug text-indigo-950 md:text-xl">
          <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            {title}
          </span>
        </h3>
        <ul className="space-y-3">
          {section.guides.map((stepKey, index) => (
            <li key={stepKey} className="flex items-start gap-3 text-base leading-relaxed">
              <span
                className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded border-2 border-indigo-950 bg-pink-400 shadow-[2px_2px_0_0_#1e1b4b]"
                aria-hidden
              />
              <p className="text-indigo-950">
                <span className="font-extrabold text-fuchsia-700">
                  {VI.general.guidelinesRules.stepLabel} {index + 1}
                </span>
                {": "}
                <span className="font-medium text-indigo-950/85">{getI18nValue(stepKey)}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
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
        <Card
          key={`${section.id}-${rule.code}`}
          className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[6px_6px_0_0_rgba(30,27,75,0.55)]"
        >
          <div className="p-4 md:p-5">
            <p className="text-xs font-extrabold uppercase tracking-wide text-fuchsia-700">
              {VI.general.guidelinesRules.rulePrefix} {rule.code}
            </p>
            <h3 className="mt-1 text-lg font-extrabold text-indigo-950">{getI18nValue(rule.titleKey)}</h3>
            <p className="mt-2 text-base font-medium leading-relaxed text-indigo-950/85">
              {getI18nValue(rule.descKey)}
            </p>
          </div>
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

  const tocButtonActive =
    "w-full rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-100 to-fuchsia-50 px-3 py-2.5 text-left text-sm font-extrabold text-indigo-950 shadow-[4px_4px_0_0_#1e1b4b] transition-all duration-200 hover:bg-pink-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 md:text-base"

  const tocButtonInactive =
    "w-full rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] px-3 py-2.5 text-left text-sm font-semibold text-indigo-950/80 shadow-[3px_3px_0_0_rgba(30,27,75,0.35)] transition-all duration-200 hover:bg-pink-50 hover:text-indigo-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 md:text-base"

  return (
    <div className="mt-1 grid gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:items-start">
      <Card className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[8px_8px_0_0_rgba(30,27,75,0.55)] lg:sticky lg:top-28 lg:self-start">
        <div className="space-y-3 p-4 md:p-5">
          <p className="text-sm font-extrabold uppercase tracking-wide text-fuchsia-700 md:text-base">
            {VI.general.guidelinesRules.cosplayRules.tocTitle}
          </p>
          <div className="space-y-2">
            {ruleGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                className={cn(activeGroupId === group.id ? tocButtonActive : tocButtonInactive)}
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
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="rounded-2xl border-[4px] border-indigo-950 bg-gradient-to-br from-pink-100 via-[#fffbeb] to-blue-100 shadow-[8px_8px_0_0_rgba(30,27,75,0.55)]">
          <div className="space-y-3 p-4 md:p-5">
            <h3 className="flex flex-wrap items-center gap-2 text-xl font-extrabold tracking-tight text-indigo-950 md:text-2xl">
              <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                {heroTitleText}
              </span>
              {section.id === "cosplay-rental" ? (
                <Sparkles
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-indigo-950 motion-safe:animate-pulse md:h-6 md:w-6"
                />
              ) : null}
            </h3>
            <p className="rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] px-3 py-2 text-base font-medium leading-relaxed text-indigo-950/90 shadow-[4px_4px_0_0_#1e1b4b]">
              {mainDescription}
            </p>
            {section.ruleIntroKeys?.length ? (
              <div className="space-y-2 text-base font-medium leading-relaxed text-indigo-950/85">
                {section.ruleIntroKeys.map((introKey) => (
                  <p key={introKey}>{getI18nValue(introKey)}</p>
                ))}
              </div>
            ) : null}
          </div>
        </Card>

        {ruleGroups.map((group) => (
          <Card
            key={group.id}
            id={`rules-${group.id}`}
            className="scroll-mt-24 rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[8px_8px_0_0_rgba(30,27,75,0.55)] transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[10px_10px_0_0_rgba(236,72,153,0.35)]"
          >
            <div className="space-y-3 p-4 md:p-5">
              <h4 className="text-xl font-extrabold text-indigo-950 md:text-2xl">
                <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  {getI18nValue(group.titleKey)}
                </span>
              </h4>
              <ul className="space-y-2.5">
                {group.ruleCodes.map((code) => {
                  const rule = ruleByCode[code]
                  if (!rule) return null

                  return (
                    <li key={`${group.id}-${code}`} className="flex items-start gap-3 text-base leading-relaxed">
                      <span
                        className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded border-2 border-indigo-950 bg-pink-300 shadow-[2px_2px_0_0_#1e1b4b]"
                        aria-hidden
                      />
                      <p className="text-indigo-950/90">
                        <span className="font-extrabold text-indigo-950">{getI18nValue(rule.titleKey)}</span>
                        {": "}
                        <span className="font-medium">{getI18nValue(rule.descKey)}</span>
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
