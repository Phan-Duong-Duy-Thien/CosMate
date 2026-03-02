export interface GuidelinesRuleItem {
  code: string
  titleKey: string
  descKey: string
}

export interface GuidelinesRuleGroup {
  id: string
  titleKey: string
  ruleCodes: string[]
}

export interface GuidelinesSection {
  id:
    | "cosplay-rental"
    | "photographer"
    | "staff"
    | "orders-returns"
    | "complaints-disputes"
  titleKey: string
  descKey: string
  cardMainKey: string
  guides: string[]
  rules: GuidelinesRuleItem[]
  ruleGroups?: GuidelinesRuleGroup[]
  ruleIntroKeys?: string[]
}

const COSPLAY_RULE_GROUPS: GuidelinesRuleGroup[] = [
  {
    id: "cosplay-legal-principles",
    titleKey: "general.guidelinesRules.cosplayRules.groups.generalPrinciples",
    ruleCodes: ["cos-role-platform", "cos-party-independence", "cos-liability-limit"],
  },
  {
    id: "cosplay-rental-verification",
    titleKey: "general.guidelinesRules.cosplayRules.groups.accountVerification",
    ruleCodes: ["cos-rental-condition", "cos-info-liability"],
  },
  {
    id: "cosplay-time-boundary",
    titleKey: "general.guidelinesRules.cosplayRules.groups.bookingCommitment",
    ruleCodes: ["cos-start-time", "cos-end-time"],
  },
  {
    id: "cosplay-care-usage",
    titleKey: "general.guidelinesRules.cosplayRules.groups.escrowFees",
    ruleCodes: ["cos-care-obligation", "cos-compensation-liability"],
  },
  {
    id: "cosplay-verification-evidence",
    titleKey: "general.guidelinesRules.cosplayRules.groups.evidenceTimeline",
    ruleCodes: ["cos-unboxing-video", "cos-return-verification", "cos-evidence-value"],
  },
  {
    id: "cosplay-deposit-deduction",
    titleKey: "general.guidelinesRules.cosplayRules.groups.scheduleCancelTransfer",
    ruleCodes: ["cos-deposit-nature", "cos-deduction-principle", "cos-conceal-fraud"],
  },
  {
    id: "cosplay-extend-cancel-late",
    titleKey: "general.guidelinesRules.cosplayRules.groups.careObligation",
    ruleCodes: ["cos-valid-extension", "cos-late-return", "cos-invalid-cancel"],
  },
  {
    id: "cosplay-exemption-force-majeure",
    titleKey: "general.guidelinesRules.cosplayRules.groups.disputesPenalties",
    ruleCodes: ["cos-liability-exemption", "cos-force-majeure"],
  },
  {
    id: "cosplay-dispute-jurisdiction",
    titleKey: "general.guidelinesRules.cosplayRules.groups.reputationBlacklist",
    ruleCodes: ["cos-cosmate-intervention", "cos-dispute-jurisdiction"],
  },
  {
    id: "cosplay-reputation-blacklist",
    titleKey: "general.guidelinesRules.cosplayRules.groups.updatesTermination",
    ruleCodes: ["cos-reputation-score", "cos-blacklist", "cos-rule-updates"],
  },
]

const STAFF_RULE_GROUPS: GuidelinesRuleGroup[] = [
  {
    id: "staff-legal-principles",
    titleKey: "general.guidelinesRules.staffRules.groups.legalPrinciples",
    ruleCodes: ["staff-role-platform", "staff-party-independence", "staff-liability-limit"],
  },
  {
    id: "staff-transaction-verification",
    titleKey: "general.guidelinesRules.staffRules.groups.transactionVerification",
    ruleCodes: ["staff-booking-condition", "staff-info-liability"],
  },
  {
    id: "staff-service-scope",
    titleKey: "general.guidelinesRules.staffRules.groups.serviceScope",
    ruleCodes: ["staff-scope-by-order", "staff-coordination-duty", "staff-no-personal-transfer"],
  },
  {
    id: "staff-time-deposit-payment",
    titleKey: "general.guidelinesRules.staffRules.groups.timeDepositPayment",
    ruleCodes: ["staff-deposit-escrow", "staff-time-overtime", "staff-invalid-cancel"],
  },
  {
    id: "staff-verification-evidence",
    titleKey: "general.guidelinesRules.staffRules.groups.verificationEvidence",
    ruleCodes: ["staff-checkin-checkout", "staff-system-evidence"],
  },
  {
    id: "staff-dispute-violation",
    titleKey: "general.guidelinesRules.staffRules.groups.disputeViolation",
    ruleCodes: ["staff-cosmate-intervention", "staff-cooperate-duty", "staff-prohibited-acts"],
  },
  {
    id: "staff-exemption-force-majeure",
    titleKey: "general.guidelinesRules.staffRules.groups.exemptionForceMajeure",
    ruleCodes: ["staff-liability-exemption", "staff-force-majeure"],
  },
  {
    id: "staff-reputation-blacklist",
    titleKey: "general.guidelinesRules.staffRules.groups.reputationBlacklist",
    ruleCodes: ["staff-rating-system", "staff-blacklist-limit"],
  },
  {
    id: "staff-update-jurisdiction",
    titleKey: "general.guidelinesRules.staffRules.groups.updateJurisdiction",
    ruleCodes: ["staff-update-right", "staff-dispute-jurisdiction"],
  },
]

const PHOTOGRAPHER_RULE_GROUPS: GuidelinesRuleGroup[] = [
  {
    id: "ptg-service-nature",
    titleKey: "general.guidelinesRules.photographerRules.groups.serviceNature",
    ruleCodes: ["ptg-creative-nature", "ptg-scope-commitment"],
  },
  {
    id: "ptg-slot-time",
    titleKey: "general.guidelinesRules.photographerRules.groups.slotTime",
    ruleCodes: ["ptg-slot-deposit", "ptg-late-arrival"],
  },
  {
    id: "ptg-delivery-copyright",
    titleKey: "general.guidelinesRules.photographerRules.groups.deliveryCopyright",
    ruleCodes: ["ptg-delivery-scope", "ptg-copyright"],
  },
  {
    id: "ptg-deposit-cancel-refund",
    titleKey:
      "general.guidelinesRules.photographerRules.groups.depositCancelRefund",
    ruleCodes: ["ptg-invalid-cancel", "ptg-provider-fault"],
  },
  {
    id: "ptg-dispute-evidence",
    titleKey: "general.guidelinesRules.photographerRules.groups.disputeEvidence",
    ruleCodes: ["ptg-system-evidence", "ptg-final-decision"],
  },
  {
    id: "ptg-liability-force-majeure",
    titleKey:
      "general.guidelinesRules.photographerRules.groups.liabilityForceMajeure",
    ruleCodes: ["ptg-liability-limit", "ptg-force-majeure"],
  },
  {
    id: "ptg-reputation-termination",
    titleKey:
      "general.guidelinesRules.photographerRules.groups.reputationTermination",
    ruleCodes: ["ptg-reputation-score", "ptg-violations", "ptg-rule-updates"],
  },
]

function cmRule(code: number): GuidelinesRuleItem {
  const normalized = String(code).padStart(2, "0")
  return {
    code: `CM-${normalized}`,
    titleKey: `general.guidelinesRules.rules.cm${normalized}.title`,
    descKey: `general.guidelinesRules.rules.cm${normalized}.desc`,
  }
}

function cosplayRule(code: string): GuidelinesRuleItem {
  return {
    code,
    titleKey: `general.guidelinesRules.cosplayRules.items.${code}.title`,
    descKey: `general.guidelinesRules.cosplayRules.items.${code}.desc`,
  }
}

function staffRule(code: string): GuidelinesRuleItem {
  return {
    code,
    titleKey: `general.guidelinesRules.staffRules.items.${code}.title`,
    descKey: `general.guidelinesRules.staffRules.items.${code}.desc`,
  }
}

function photographerRule(code: string): GuidelinesRuleItem {
  return {
    code,
    titleKey: `general.guidelinesRules.photographerRules.items.${code}.title`,
    descKey: `general.guidelinesRules.photographerRules.items.${code}.desc`,
  }
}

export const GUIDELINES_RULES_SECTIONS: GuidelinesSection[] = [
  {
    id: "cosplay-rental",
    titleKey: "general.guidelinesRules.sections.cosplayRental.title",
    descKey: "general.guidelinesRules.sections.cosplayRental.desc",
    cardMainKey: "general.guidelinesRules.cardMain.cosplayRental",
    guides: [
      "general.guidelinesRules.guides.cosplayRental.step1",
      "general.guidelinesRules.guides.cosplayRental.step2",
      "general.guidelinesRules.guides.cosplayRental.step3",
      "general.guidelinesRules.guides.cosplayRental.step4",
      "general.guidelinesRules.guides.cosplayRental.step5",
      "general.guidelinesRules.guides.cosplayRental.step6",
    ],
    rules: [
      "cos-role-platform",
      "cos-party-independence",
      "cos-liability-limit",
      "cos-rental-condition",
      "cos-info-liability",
      "cos-start-time",
      "cos-end-time",
      "cos-care-obligation",
      "cos-compensation-liability",
      "cos-unboxing-video",
      "cos-return-verification",
      "cos-evidence-value",
      "cos-deposit-nature",
      "cos-deduction-principle",
      "cos-conceal-fraud",
      "cos-valid-extension",
      "cos-late-return",
      "cos-invalid-cancel",
      "cos-liability-exemption",
      "cos-force-majeure",
      "cos-cosmate-intervention",
      "cos-dispute-jurisdiction",
      "cos-reputation-score",
      "cos-blacklist",
      "cos-rule-updates",
    ].map(cosplayRule),
    ruleGroups: COSPLAY_RULE_GROUPS,
    ruleIntroKeys: [
      "general.guidelinesRules.cosplayRules.introAcknowledgement",
      "general.guidelinesRules.cosplayRules.introPriority",
    ],
  },
  {
    id: "photographer",
    titleKey: "general.guidelinesRules.sections.photographer.title",
    descKey: "general.guidelinesRules.sections.photographer.desc",
    cardMainKey: "general.guidelinesRules.cardMain.photographer",
    guides: [
      "general.guidelinesRules.guides.photographer.step1",
      "general.guidelinesRules.guides.photographer.step2",
      "general.guidelinesRules.guides.photographer.step3",
      "general.guidelinesRules.guides.photographer.step4",
      "general.guidelinesRules.guides.photographer.step5",
      "general.guidelinesRules.guides.photographer.step6",
    ],
    rules: [
      "ptg-creative-nature",
      "ptg-scope-commitment",
      "ptg-slot-deposit",
      "ptg-late-arrival",
      "ptg-delivery-scope",
      "ptg-copyright",
      "ptg-invalid-cancel",
      "ptg-provider-fault",
      "ptg-system-evidence",
      "ptg-final-decision",
      "ptg-liability-limit",
      "ptg-force-majeure",
      "ptg-reputation-score",
      "ptg-violations",
      "ptg-rule-updates",
    ].map(photographerRule),
    ruleGroups: PHOTOGRAPHER_RULE_GROUPS,
    ruleIntroKeys: [
      "general.guidelinesRules.photographerRules.introAcknowledgement",
      "general.guidelinesRules.photographerRules.introPriority",
    ],
  },
  {
    id: "staff",
    titleKey: "general.guidelinesRules.sections.staff.title",
    descKey: "general.guidelinesRules.sections.staff.desc",
    cardMainKey: "general.guidelinesRules.cardMain.staff",
    guides: [
      "general.guidelinesRules.guides.staff.step1",
      "general.guidelinesRules.guides.staff.step2",
      "general.guidelinesRules.guides.staff.step3",
      "general.guidelinesRules.guides.staff.step4",
      "general.guidelinesRules.guides.staff.step5",
      "general.guidelinesRules.guides.staff.step6",
    ],
    rules: [
      "staff-role-platform",
      "staff-party-independence",
      "staff-liability-limit",
      "staff-booking-condition",
      "staff-info-liability",
      "staff-scope-by-order",
      "staff-coordination-duty",
      "staff-no-personal-transfer",
      "staff-deposit-escrow",
      "staff-time-overtime",
      "staff-invalid-cancel",
      "staff-checkin-checkout",
      "staff-system-evidence",
      "staff-cosmate-intervention",
      "staff-cooperate-duty",
      "staff-prohibited-acts",
      "staff-liability-exemption",
      "staff-force-majeure",
      "staff-rating-system",
      "staff-blacklist-limit",
      "staff-update-right",
      "staff-dispute-jurisdiction",
    ].map(staffRule),
    ruleGroups: STAFF_RULE_GROUPS,
    ruleIntroKeys: [
      "general.guidelinesRules.staffRules.introAcknowledgement",
      "general.guidelinesRules.staffRules.introPriority",
    ],
  },
  {
    id: "orders-returns",
    titleKey: "general.guidelinesRules.sections.ordersReturns.title",
    descKey: "general.guidelinesRules.sections.ordersReturns.desc",
    cardMainKey: "general.guidelinesRules.cardMain.ordersReturns",
    guides: [
      "general.guidelinesRules.guides.ordersReturns.step1",
      "general.guidelinesRules.guides.ordersReturns.step2",
      "general.guidelinesRules.guides.ordersReturns.step3",
      "general.guidelinesRules.guides.ordersReturns.step4",
      "general.guidelinesRules.guides.ordersReturns.step5",
    ],
    rules: [3, 12, 13, 17, 23, 24, 25, 29].map(cmRule),
  },
  {
    id: "complaints-disputes",
    titleKey: "general.guidelinesRules.sections.complaintsDisputes.title",
    descKey: "general.guidelinesRules.sections.complaintsDisputes.desc",
    cardMainKey: "general.guidelinesRules.cardMain.complaintsDisputes",
    guides: [
      "general.guidelinesRules.guides.complaintsDisputes.step1",
      "general.guidelinesRules.guides.complaintsDisputes.step2",
      "general.guidelinesRules.guides.complaintsDisputes.step3",
      "general.guidelinesRules.guides.complaintsDisputes.step4",
      "general.guidelinesRules.guides.complaintsDisputes.step5",
    ],
    rules: [9, 10, 13, 18, 19, 29, 30].map(cmRule),
  },
]
