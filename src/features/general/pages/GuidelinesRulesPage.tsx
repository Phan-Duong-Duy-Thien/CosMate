import * as React from "react"

import {
  GUIDELINES_RULES_SECTIONS,
  type GuidelinesRuleItem,
  type GuidelinesSection,
} from "../constants/guidelinesRulesContent"
import { VI } from "@/shared/i18n/vi"
import { cn } from "@/lib/utils"

type ContentView = "guide" | "rules"

function getI18nValue(path: string): string {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== "object" || !(part in acc)) {
      return path
    }
    return (acc as Record<string, unknown>)[part]
  }, VI) as string
}

export default function GuidelinesRulesPage() {
  const [activeSectionId, setActiveSectionId] = React.useState(
    GUIDELINES_RULES_SECTIONS[0]?.id
  )
  const [activeView, setActiveView] = React.useState<ContentView>("guide")
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
    <section className="min-h-screen bg-transparent py-8 [font-family:'Be_Vietnam_Pro','Nunito','Inter',ui-sans-serif,system-ui] md:py-10">
      <style>{`
        @keyframes sparkleBlink {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.6; transform: scale(1); }
        }
        @keyframes softSparkle {
          0% { opacity: 0.6; transform: translateY(0px); }
          50% { opacity: 1; transform: translateY(-1px); }
          100% { opacity: 0.6; transform: translateY(0px); }
        }
      `}</style>
      <div className="mx-auto w-full">
        <div
          className={cn(
            "rounded-3xl border border-white/70 bg-white/68 p-6 shadow-[0_16px_40px_rgba(236,72,153,0.08)] backdrop-blur-sm transition-all duration-300 ease-out md:p-8",
            pageVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}
        >
          <div className="mb-10 text-center md:mb-12">
            <h1 className="mb-4 text-[28px] font-bold leading-[1.2] tracking-[-0.5px] text-slate-900 md:text-[34px] xl:text-[40px]">
              {VI.general.guidelinesRules.pageTitle}
            </h1>
            <p className="mx-auto max-w-[700px] text-base font-medium leading-[1.7] text-slate-700/80 md:text-[18px]">
              {VI.general.guidelinesRules.pageSubtitle}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {GUIDELINES_RULES_SECTIONS.map((section) => {
              const selected = section.id === activeSection.id

              return (
                <button
                  key={section.id}
                  type="button"
                  className={cn(
                    "group relative rounded-2xl border p-4 text-left transition-all duration-300 active:scale-[0.98] hover:-translate-y-0.5 xl:min-h-32",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300",
                    selected
                      ? "border-pink-300 bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 shadow-[0_14px_30px_rgba(236,72,153,0.2)]"
                      : "border-pink-200 bg-gradient-to-br from-white via-pink-50 to-rose-100 hover:border-pink-300 hover:from-pink-100 hover:to-purple-100 hover:shadow-[0_12px_24px_rgba(236,72,153,0.14)]"
                  )}
                  onClick={() => {
                    setActiveSectionId(section.id)
                    setActiveView("guide")
                  }}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center text-[18px] text-pink-500/80 transition-all duration-300 [animation:sparkleBlink_2.8s_ease-in-out_infinite] motion-reduce:animate-none",
                      "group-hover:scale-110 group-hover:text-pink-600 group-hover:brightness-110"
                    )}
                  >
                    ✦
                  </span>
                  <p className="mb-2 text-[12px] font-medium tracking-[0.3px] text-slate-700/70">
                    {VI.general.guidelinesRules.cardSmallTitle}
                  </p>
                  <h2 className="text-[20px] font-bold leading-[1.3] tracking-[0.5px] text-slate-900 md:text-[24px]">
                    {getI18nValue(section.cardMainKey)}
                  </h2>
                </button>
              )
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {tabButtons.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300",
                    activeView === tab.key
                      ? "bg-[#FDCCD7] text-pink-900 border-2 border-[#FDCCD7]"
                      : "bg-pink-50 text-pink-700 hover:bg-pink-100"
                  )}
                  onClick={() => setActiveView(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              className={cn(
                "transition-all duration-250 ease-out",
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
        </div>
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
    <div className="mt-3 rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100 p-4 md:p-4">
      <h3 className="text-[18px] font-semibold leading-[1.3] tracking-[0.3px] text-pink-700 md:text-[22px]">
        {title}
      </h3>
      <ul className="mt-2.5 space-y-2">
        {section.guides.map((stepKey, index) => (
          <li
            key={stepKey}
            className="flex items-start gap-2.5 text-base leading-7 text-slate-700 md:text-[17px]"
          >
            <span className="mt-1 text-xs text-pink-500">✿</span>
            <p>
              <span className="font-semibold text-pink-600">
                {VI.general.guidelinesRules.stepLabel} {index + 1}
              </span>
              {": "}
              {getI18nValue(stepKey)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RulesList({ section }: { section: GuidelinesSection }) {
  if (section.ruleGroups?.length) {
    return <CosplayRulesLayout section={section} />
  }

  return (
    <div className="mt-3 space-y-2">
      {section.rules.map((rule) => (
        <article
          key={`${section.id}-${rule.code}`}
          className="rounded-2xl border border-pink-100 bg-pink-50/40 p-3.5 md:p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
            {VI.general.guidelinesRules.rulePrefix} {rule.code}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {getI18nValue(rule.titleKey)}
          </h3>
          <p className="mt-1 text-base leading-7 text-slate-700 md:text-[17px]">{getI18nValue(rule.descKey)}</p>
        </article>
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
    <div className="mt-3 grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
      <aside className="rounded-2xl border border-pink-100 bg-pink-50/60 p-5 lg:sticky lg:top-32 lg:self-start md:p-6">
        <p className="text-base font-semibold uppercase tracking-wide text-pink-700 md:text-lg">
          {VI.general.guidelinesRules.cosplayRules.tocTitle}
        </p>
        <div className="mt-3 space-y-2">
          {ruleGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              className={cn(
                "block w-full rounded-lg border-l-2 px-3 py-2 text-left text-sm leading-relaxed transition-colors md:text-base",
                activeGroupId === group.id
                  ? "border-pink-500 bg-pink-100/70 text-pink-700 shadow-sm"
                  : "border-transparent bg-transparent font-medium text-pink-300 hover:border-pink-200 hover:bg-pink-50/70 hover:text-pink-500"
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
      </aside>

      <div className="space-y-3 md:space-y-4">
        <div className="group rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-100 via-rose-50 to-purple-100 p-3.5 md:p-4">
          <h3 className="flex flex-wrap items-center gap-2 text-xl font-semibold tracking-wide text-pink-700 md:text-2xl">
            <span>{heroTitleText}</span>
            {section.id === "cosplay-rental" ? (
              <span
                aria-hidden="true"
                className="text-[14px] tracking-[0.4px] text-pink-500/85 transition duration-300 [animation:softSparkle_3s_ease-in-out_infinite] motion-reduce:animate-none md:text-[16px] xl:text-[18px] group-hover:brightness-110"
              >
                ⋆. 𐙚˚࿔   𝜗𝜚˚⋆
              </span>
            ) : null}
          </h3>
          <p className="mt-1.5 text-base leading-7 text-slate-700 md:text-[17px]">
            {mainDescription}
          </p>
          {section.ruleIntroKeys?.length ? (
            <div className="mt-2.5 space-y-1.5 text-base leading-7 text-slate-700 md:text-[17px]">
              {section.ruleIntroKeys.map((introKey) => (
                <p key={introKey}>{getI18nValue(introKey)}</p>
              ))}
            </div>
          ) : null}
        </div>

        {ruleGroups.map((group) => (
          <section
            key={group.id}
            id={`rules-${group.id}`}
            className="scroll-mt-24 rounded-2xl border border-pink-100 bg-white p-3.5 md:p-4"
          >
            <h4 className="text-xl font-extrabold text-pink-600 md:text-2xl">
              {getI18nValue(group.titleKey)}
            </h4>
            <ul className="mt-2 space-y-1.5">
              {group.ruleCodes.map((code) => {
                const rule = ruleByCode[code]
                if (!rule) return null

                return (
                  <li
                    key={`${group.id}-${code}`}
                    className="flex items-start gap-2.5 text-base leading-7 text-slate-700 md:text-[17px]"
                  >
                    <span className="mt-1 text-xs text-slate-500">✿</span>
                    <p>
                      <span className="font-semibold text-slate-900">
                        {getI18nValue(rule.titleKey)}
                      </span>
                      {": "}
                      {getI18nValue(rule.descKey)}
                    </p>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
