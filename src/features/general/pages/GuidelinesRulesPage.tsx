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

  const activeSection =
    GUIDELINES_RULES_SECTIONS.find((section) => section.id === activeSectionId) ??
    GUIDELINES_RULES_SECTIONS[0]

  const tabButtons: Array<{ key: ContentView; label: string }> = [
    { key: "guide", label: VI.general.guidelinesRules.tabs.guide },
    { key: "rules", label: VI.general.guidelinesRules.tabs.rules },
  ]

  return (
    <section className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 py-8 [font-family:'Be_Vietnam_Pro','Nunito','Inter',ui-sans-serif,system-ui] md:py-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_16px_40px_rgba(236,72,153,0.08)] backdrop-blur-sm md:p-8">
          <div className="mb-10 text-center md:mb-12">
            <h1 className="mb-4 text-[28px] font-bold leading-[1.2] tracking-[-0.5px] text-slate-900 md:text-[34px] xl:text-[40px]">
              {VI.general.guidelinesRules.pageTitle}
            </h1>
            <p className="mx-auto max-w-[640px] text-[14px] font-medium leading-[1.6] text-slate-700/80 md:text-[16px]">
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
                    "rounded-2xl border p-4 text-left transition-all xl:min-h-32",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300",
                    selected
                      ? "border-pink-300 bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 shadow-[0_12px_26px_rgba(236,72,153,0.18)]"
                      : "border-pink-200 bg-gradient-to-br from-white via-pink-50 to-rose-100 hover:border-pink-300 hover:from-pink-100 hover:to-purple-100"
                  )}
                  onClick={() => {
                    setActiveSectionId(section.id)
                    setActiveView("guide")
                  }}
                >
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
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300",
                    activeView === tab.key
                      ? "bg-pink-500 text-white"
                      : "bg-pink-50 text-pink-700 hover:bg-pink-100"
                  )}
                  onClick={() => setActiveView(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeView === "guide" ? (
              <GuideList section={activeSection} />
            ) : (
              <RulesList section={activeSection} />
            )}
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
      : `${VI.general.guidelinesRules.tabs.guide} ${getI18nValue(section.titleKey)}`

  return (
    <div className="mt-4 rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100 p-4 md:p-5">
      <h3 className="text-[18px] font-semibold leading-[1.3] tracking-[0.3px] text-pink-700 md:text-[22px]">
        {title}
      </h3>
      <ul className="mt-3 space-y-3">
        {section.guides.map((stepKey, index) => (
          <li
            key={stepKey}
            className="flex items-start gap-2.5 text-sm leading-7 text-slate-700"
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
    <div className="mt-4 space-y-3">
      {section.rules.map((rule) => (
        <article
          key={`${section.id}-${rule.code}`}
          className="rounded-2xl border border-pink-100 bg-pink-50/40 p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
            {VI.general.guidelinesRules.rulePrefix} {rule.code}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-slate-900">
            {getI18nValue(rule.titleKey)}
          </h3>
          <p className="mt-1 text-sm text-slate-700">{getI18nValue(rule.descKey)}</p>
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
      : VI.general.guidelinesRules.cosplayRules.mainTitle
  const mainDescription =
    section.id === "staff"
      ? VI.general.guidelinesRules.staffRules.mainDescription
      : section.id === "photographer"
        ? VI.general.guidelinesRules.photographerRules.mainDescription
      : VI.general.guidelinesRules.cosplayRules.mainDescription

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
    <div className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl border border-pink-100 bg-pink-50/60 p-4 lg:sticky lg:top-6 lg:self-start">
        <p className="text-sm font-semibold uppercase tracking-wide text-pink-700">
          {VI.general.guidelinesRules.cosplayRules.tocTitle}
        </p>
        <div className="mt-3 space-y-1.5">
          {ruleGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              className={cn(
                "block w-full rounded-lg border-l-2 px-2.5 py-1.5 text-left text-sm leading-6 transition-colors",
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

      <div className="space-y-4">
        <div className="rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-100 via-rose-50 to-purple-100 p-4 md:p-5">
          <h3 className="text-xl font-semibold tracking-wide text-pink-700 md:text-2xl">
            {mainTitle}
          </h3>
          <p className="mt-2 text-sm text-slate-700">
            {mainDescription}
          </p>
          {section.ruleIntroKeys?.length ? (
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
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
            className="scroll-mt-24 rounded-2xl border border-pink-100 bg-white p-4 md:p-5"
          >
            <h4 className="text-lg font-extrabold text-pink-600 md:text-xl">
              {getI18nValue(group.titleKey)}
            </h4>
            <ul className="mt-3 space-y-3">
              {group.ruleCodes.map((code) => {
                const rule = ruleByCode[code]
                if (!rule) return null

                return (
                  <li
                    key={`${group.id}-${code}`}
                    className="flex items-start gap-2.5 text-sm leading-7 text-slate-700"
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
