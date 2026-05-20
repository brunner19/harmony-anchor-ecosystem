import { currency } from "../lib/format.js";

export function designUpgrade(input = {}) {
  const community = input.community || {};
  const constraints = {
    ...(community.upgradeConstraints || {}),
    ...(input.constraints || {})
  };
  const households = Number(input.households || community.households || 100);
  const residents = Number(input.residents || community.estimatedResidents || households * 5);
  const budget = Number(constraints.maxInitialBudgetUsd || input.budgetUsd || households * 1200);
  const phases = buildPhases(households, residents, budget, constraints);

  return {
    agent: "Upgrade Designer",
    designName: `${community.name || "Community"} Dignity Upgrade Kit`,
    principles: [
      "Keep families close to livelihoods, schools, water access, and community networks.",
      "Use modular service cores so sanitation, power, and drainage upgrades can advance block by block.",
      "Design for flood events, heat stress, fire access, child safety, and maintenance from day one.",
      "Prefer reversible and relocatable systems where tenure is unsettled, while negotiating formal tenure."
    ],
    technicalSpec: {
      housing: [
        "Incremental stilt or raised-platform modules sized for household expansion.",
        "Firebreak lanes every 30-45 meters where site geometry allows.",
        "Locally maintainable timber/steel hybrid frames with treated components and replaceable decking."
      ],
      infrastructure: [
        "Raised pedestrian spine with solar lighting and emergency access nodes.",
        "Containerized or prefabricated sanitation hubs with handwashing and menstrual hygiene support.",
        "Rainwater capture, greywater channels, and flood-safe waste collection points.",
        "Micro-grid readiness: solar canopies, battery cabinets above flood datum, and metered community loads."
      ],
      publicAssets: [
        "Multi-use school/community hall above flood datum.",
        "Clinic and legal-aid kiosk colocated with evidence intake and consent support.",
        "Revenue docks/kiosks for fisheries, repair, market, and cooperative services."
      ],
      resilience: [
        "Design flood datum from recent high-water marks plus safety margin.",
        "Separate public evidence maps from sensitive household identity data.",
        "Use phased construction so no family is displaced without a mapped temporary option."
      ]
    },
    costEstimate: estimateCosts(households, budget),
    phases,
    bimDescription: renderBimDescription(community, constraints),
    visualizationPrompt: renderVisualizationPrompt(community, constraints),
    permitChecklist: [
      "Site survey and participatory base map",
      "Flood and drainage assessment",
      "Structural safety review for raised platforms and public buildings",
      "Fire access and emergency egress review",
      "Sanitation and environmental health review",
      "Planning permit pathway under Lagos planning authorities",
      "Community consent record and grievance channel"
    ],
    assumptions: [
      "Costing is a concept estimate for prioritization, not a bill of quantities.",
      "Licensed architects, engineers, planners, and community leaders must validate all designs before construction.",
      "The first release emphasizes in-situ upgrading; relocation is treated as a last resort requiring safeguards."
    ]
  };
}

function estimateCosts(households, budget) {
  const sanitation = Math.round(budget * 0.22);
  const access = Math.round(budget * 0.2);
  const housing = Math.round(budget * 0.28);
  const publicAssets = Math.round(budget * 0.18);
  const contingency = budget - sanitation - access - housing - publicAssets;
  return {
    currency: "USD",
    totalConceptBudget: budget,
    perHousehold: Math.round(budget / Math.max(households, 1)),
    lines: [
      { item: "Sanitation and water hubs", amount: sanitation, display: currency(sanitation) },
      { item: "Raised access, lighting, drainage", amount: access, display: currency(access) },
      { item: "Housing stabilization modules", amount: housing, display: currency(housing) },
      { item: "School, clinic, revenue kiosks", amount: publicAssets, display: currency(publicAssets) },
      { item: "Design, permits, contingency", amount: contingency, display: currency(contingency) }
    ]
  };
}

function buildPhases(households, residents, budget, constraints) {
  return [
    {
      name: "Phase 0: Proof and protection",
      duration: "0-14 days",
      outputs: ["evidence map", "safety audit", "legal pause request", "community consent protocol"],
      target: `${households} households and ${residents} residents documented without exposing private data`
    },
    {
      name: "Phase 1: No-regrets infrastructure",
      duration: "2-8 weeks",
      outputs: ["raised pilot walkway", "sanitation hub", "solar lighting", "firebreak and egress markings"],
      target: `Deploy ${currency(Math.round(budget * 0.35))} in visible safety improvements`
    },
    {
      name: "Phase 2: Modular public assets",
      duration: "2-6 months",
      outputs: ["school/community hall", "clinic/legal kiosk", "revenue dock", "maintenance cooperative"],
      target: constraints.floodRisk === "high" ? "All public assets above flood datum" : "Public assets code-reviewed"
    },
    {
      name: "Phase 3: Tenure and scale",
      duration: "6-18 months",
      outputs: ["tenure pathway", "service connections", "cooperative revenue model", "replication kit"],
      target: "Formalize upgrade compact and scale block-by-block"
    }
  ];
}

function renderBimDescription(community, constraints) {
  return [
    `Create a BIM model for ${community.name || "an informal waterfront community"} using WGS84 site coordinates.`,
    "Layers: existing structures, waterways, access paths, public assets, risk buffers, flood datum, service cores, and phased construction zones.",
    constraints.powerLineSetbackMeters
      ? `Apply ${constraints.powerLineSetbackMeters}m power-line setback buffer as a no-build or low-occupancy corridor pending engineering verification.`
      : null,
    "Model modular 3m x 6m living bays, raised walkways, sanitation pods, solar canopies, water points, and emergency access nodes."
  ]
    .filter(Boolean)
    .join(" ");
}

function renderVisualizationPrompt(community, constraints) {
  return `Architectural visualization of ${community.name || "a Lagos waterfront settlement"} transformed through in-situ upgrading: raised timber and steel walkways, flood-resilient modular homes, school and clinic pavilions, sanitation hubs, solar lighting, small revenue kiosks, visible lagoon edge, warm daylight, practical human-scale design, no luxury displacement aesthetic, community dignity and safety foregrounded${constraints.floodRisk ? `, ${constraints.floodRisk} flood-risk context` : ""}.`;
}
