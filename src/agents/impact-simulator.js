import { currency, compactNumber } from "../lib/format.js";

export function simulateImpact(input = {}) {
  const community = input.community || {};
  const upgrade = input.upgrade || {};
  const households = Number(community.households || input.households || 100);
  const residents = Number(community.estimatedResidents || input.residents || households * 5);
  const budget = Number(upgrade.costEstimate?.totalConceptBudget || community.upgradeConstraints?.maxInitialBudgetUsd || households * 1200);
  const jobs = Math.round(households * 0.22 + residents * 0.035);
  const annualLocalRevenue = Math.round(households * 135 + jobs * 720);
  const emergencyCostAvoided = Math.round(residents * 95 + households * 320);
  const litigationRiskCost = Math.round(budget * 0.35);
  const demolitionCost = Math.round(households * 850 + residents * 90);

  const upgrading = {
    upfrontCost: budget,
    annualRevenuePotential: annualLocalRevenue,
    jobsCreated: jobs,
    peopleProtected: residents,
    schoolDaysProtected: Math.round((community.children || residents * 0.32) * 180),
    emergencyCostAvoided,
    prRisk: "low if participatory and transparent",
    legalRisk: "lower if due process, safeguards, and tenure pathway are documented",
    environmentalImpact: "improved sanitation, flood adaptation, lower debris and displacement footprint"
  };

  const demolition = {
    directCost: demolitionCost,
    annualRevenuePotential: Math.round(annualLocalRevenue * 0.12),
    jobsLost: Math.round(jobs * 1.6),
    peopleDisplaced: residents,
    emergencyReliefExposure: emergencyCostAvoided,
    litigationRiskCost,
    prRisk: "high; loss of livelihoods, schooling disruption, and international attention likely",
    legalRisk: "high if notice, consultation, compensation, relocation, or remedies are deficient",
    environmentalImpact: "debris, water pollution, livelihood displacement, and informal resettlement pressure"
  };

  return {
    agent: "Impact Simulator",
    assumptions: [
      "Conservative concept model for negotiation, not a financial prospectus.",
      "Revenue estimates combine modest household formalization, micro-enterprise activity, and avoided public cost.",
      "All figures must be replaced with local survey data before investment or litigation use."
    ],
    economicModel: {
      upgrading,
      demolition,
      netWinWinSignal: Math.round(annualLocalRevenue + emergencyCostAvoided + litigationRiskCost - budget * 0.15)
    },
    socialMetrics: [
      { label: "Residents protected", value: residents, display: compactNumber(residents) },
      { label: "Children's school days protected", value: upgrading.schoolDaysProtected, display: compactNumber(upgrading.schoolDaysProtected) },
      { label: "Jobs created or stabilized", value: jobs, display: compactNumber(jobs) },
      { label: "Households kept near livelihoods", value: households, display: compactNumber(households) }
    ],
    environmentalMetrics: [
      "Reduced demolition debris and lagoon dumping.",
      "Flood-safe sanitation lowers contamination risk.",
      "Solar lighting and micro-grid readiness reduce generator dependence.",
      "Phased upgrades avoid secondary informal resettlement pressure."
    ],
    comparisonTable: [
      {
        metric: "Upfront public/project cost",
        upgrading: currency(upgrading.upfrontCost),
        demolition: currency(demolition.directCost)
      },
      {
        metric: "Annual local revenue potential",
        upgrading: currency(upgrading.annualRevenuePotential),
        demolition: currency(demolition.annualRevenuePotential)
      },
      {
        metric: "People displaced",
        upgrading: "0 target",
        demolition: compactNumber(demolition.peopleDisplaced)
      },
      {
        metric: "Legal/PR exposure",
        upgrading: "lower with safeguards",
        demolition: `${currency(demolition.litigationRiskCost)}+ risk exposure`
      }
    ]
  };
}
