import { useMemo, useState } from 'react';
import { Modal } from 'antd';
import { VI } from '@/shared/i18n/vi';
import {
  GUIDELINES_RULES_SECTIONS,
  type GuidelinesSection,
} from '@/features/general/constants/guidelinesRulesContent';

type ContentView = 'guide' | 'rules';

interface CheckoutPolicyModalProps {
  open: boolean;
  onClose: () => void;
}

function getI18nValue(path: string): string {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== 'object' || !(part in acc)) {
      return path;
    }
    return (acc as Record<string, unknown>)[part];
  }, VI) as string;
}

function getGuideTitle(sectionId: GuidelinesSection['id']) {
  switch (sectionId) {
    case 'cosplay-rental':
      return VI.general.guidelinesRules.cosplayGuideTitle;
    case 'photographer':
      return VI.general.guidelinesRules.photographerGuideTitle;
    case 'staff':
      return VI.general.guidelinesRules.staffGuideTitle;
    case 'orders-returns':
      return VI.general.guidelinesRules.ordersReturnsGuideTitle;
    case 'complaints-disputes':
      return VI.general.guidelinesRules.complaintsGuideTitle;
    default:
      return VI.general.guidelinesRules.tabs.guide;
  }
}

export function CheckoutPolicyModal({ open, onClose }: CheckoutPolicyModalProps) {
  const [activeSectionId, setActiveSectionId] = useState(
    GUIDELINES_RULES_SECTIONS[0]?.id ?? 'cosplay-rental'
  );
  const [activeView, setActiveView] = useState<ContentView>('guide');

  const activeSection = useMemo(
    () =>
      GUIDELINES_RULES_SECTIONS.find((section) => section.id === activeSectionId) ??
      GUIDELINES_RULES_SECTIONS[0],
    [activeSectionId]
  );

  return (
    <Modal
      title="Điều khoản và quy định"
      open={open}
      onCancel={onClose}
      footer={null}
      width={920}
      destroyOnClose={false}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {GUIDELINES_RULES_SECTIONS.map((section) => {
            const isActive = section.id === activeSection?.id;
            return (
              <button
                key={section.id}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  isActive
                    ? 'border-pink-300 bg-pink-50 text-pink-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-pink-200 hover:text-pink-600'
                }`}
                onClick={() => setActiveSectionId(section.id)}
              >
                {getI18nValue(section.cardMainKey)}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeView === 'guide'
                ? 'bg-pink-100 text-pink-700'
                : 'bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-pink-600'
            }`}
            onClick={() => setActiveView('guide')}
          >
            {VI.general.guidelinesRules.tabs.guide}
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeView === 'rules'
                ? 'bg-pink-100 text-pink-700'
                : 'bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-pink-600'
            }`}
            onClick={() => setActiveView('rules')}
          >
            {VI.general.guidelinesRules.tabs.rules}
          </button>
        </div>

        <div className="max-h-[62vh] space-y-3 overflow-y-auto pr-1">
          {activeView === 'guide' ? (
            <div className="rounded-2xl border border-pink-100 bg-pink-50/40 p-4">
              <h3 className="text-base font-semibold text-pink-700">
                {getGuideTitle(activeSection.id)}
              </h3>
              <ul className="mt-3 space-y-2">
                {activeSection.guides.map((stepKey, index) => (
                  <li key={stepKey} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-pink-500">✿</span>
                    <p>
                      <span className="font-semibold text-pink-600">
                        {VI.general.guidelinesRules.stepLabel} {index + 1}
                      </span>
                      {': '}
                      {getI18nValue(stepKey)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            activeSection.rules.map((rule) => (
              <article
                key={`${activeSection.id}-${rule.code}`}
                className="rounded-2xl border border-pink-100 bg-pink-50/30 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                  {VI.general.guidelinesRules.rulePrefix} {rule.code}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-slate-900">
                  {getI18nValue(rule.titleKey)}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {getI18nValue(rule.descKey)}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
