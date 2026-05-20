import { clamp, unique } from "../lib/format.js";
import { sha256 } from "../lib/hash.js";

const TRIGGERS = [
  {
    id: "heavy-equipment",
    label: "Heavy equipment or demolition staging",
    weight: 20,
    terms: ["excavator", "bulldozer", "caterpillar", "demolition truck", "payloader", "armed task force"]
  },
  {
    id: "survey-markers",
    label: "Survey markers or enumeration without consent",
    weight: 15,
    terms: ["survey marker", "paint mark", "enumeration", "peg", "staking", "cadastral"]
  },
  {
    id: "government-notice",
    label: "Government notice or public statement",
    weight: 18,
    terms: ["notice", "quit", "vacate", "regeneration", "beautification", "right of way", "public safety"]
  },
  {
    id: "security-presence",
    label: "Security or enforcement presence",
    weight: 18,
    terms: ["police", "task force", "soldier", "security", "arrest", "raid", "sealed"]
  },
  {
    id: "land-value",
    label: "Land value or developer pressure",
    weight: 11,
    terms: ["developer", "luxury", "waterfront", "mall", "hotel", "land value", "investor"]
  },
  {
    id: "infrastructure-pretext",
    label: "Infrastructure or safety pretext",
    weight: 13,
    terms: ["power line", "pipeline", "drainage", "road expansion", "setback", "flood control"]
  }
];

export function analyzeThreat(input = {}) {
  const community = input.community || {};
  const riskInputs = community.riskInputs || input.riskInputs || {};
  const textSignals = [
    input.situation,
    input.description,
    ...(riskInputs.recentReports || []),
    ...(riskInputs.policySignals || []),
    ...(input.news || []),
    ...(input.announcements || [])
  ]
    .filter(Boolean)
    .join(" \n ")
    .toLowerCase();

  const triggerMatches = TRIGGERS.map((trigger) => {
    const hits = trigger.terms.filter((term) => textSignals.includes(term));
    return hits.length
      ? {
          id: trigger.id,
          label: trigger.label,
          hits,
          weight: trigger.weight
        }
      : null;
  }).filter(Boolean);

  const satellite = riskInputs.satelliteSignals || input.satelliteSignals || {};
  const satelliteScore =
    clamp(Number(satellite.vegetationLossPercent || 0) * 1.2, 0, 12) +
    clamp(Number(satellite.newRoadworksMeters || 0) / 25, 0, 16) +
    clamp(Number(satellite.demolitionScars || 0) * 15, 0, 25);

  const evidenceScore = clamp((input.evidence || community.sampleEvidence || []).length * 4, 0, 14);
  const baseScore = triggerMatches.reduce((sum, trigger) => sum + trigger.weight, 12);
  const riskScore = Math.round(clamp(baseScore + satelliteScore + evidenceScore, 0, 100));
  const confidence = calculateConfidence({ triggerMatches, satellite, evidenceCount: evidenceScore / 4 });
  const timeline = estimateTimeline(riskScore, triggerMatches);

  const evidenceSummary = (input.evidence || community.sampleEvidence || []).map((item, index) => ({
    id: item.id || `evidence-${index + 1}`,
    type: item.type || "unknown",
    description: item.description || item.filename || "Community-submitted evidence",
    hash: sha256(item)
  }));

  return {
    agent: "Threat Sentinel",
    riskScore,
    confidence,
    timeline,
    level: riskLevel(riskScore),
    triggers: triggerMatches.map((trigger) => ({
      label: trigger.label,
      matchedSignals: unique(trigger.hits),
      severity: trigger.weight >= 18 ? "high" : trigger.weight >= 13 ? "medium" : "watch"
    })),
    recommendedImmediateActions: recommendedActions(riskScore, triggerMatches),
    evidenceSummary,
    conservativeNotes: [
      "This score is a triage signal, not a factual finding.",
      "Human verification is required before public accusations or legal filing.",
      "False positives are handled by routing to documentation, dialogue, and counsel review first."
    ]
  };
}

function calculateConfidence({ triggerMatches, satellite, evidenceCount }) {
  let confidence = 42;
  confidence += clamp(triggerMatches.length * 9, 0, 30);
  confidence += Object.keys(satellite || {}).length ? 12 : 0;
  confidence += clamp(evidenceCount * 5, 0, 16);
  return `${Math.round(clamp(confidence, 20, 92))}%`;
}

function estimateTimeline(score, triggers) {
  const hasEquipment = triggers.some((trigger) => trigger.id === "heavy-equipment");
  const hasSecurity = triggers.some((trigger) => trigger.id === "security-presence");
  if (score >= 85 || (hasEquipment && hasSecurity)) return "0-7 days; prepare emergency legal and media response.";
  if (score >= 70 || hasEquipment) return "1-3 weeks; urgent verification, legal review, and stakeholder outreach.";
  if (score >= 50) return "3-8 weeks; monitor daily and build evidence packet.";
  if (score >= 30) return "1-3 months; keep watch list active.";
  return "No immediate timeline detected; continue weekly monitoring.";
}

function riskLevel(score) {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "elevated";
  if (score >= 25) return "watch";
  return "low";
}

function recommendedActions(score, triggers) {
  const actions = [
    "Open a consent-based evidence log with timestamps, GPS, witness notes, and hashes.",
    "Verify official notices through trusted counsel or civic partners before escalation.",
    "Prepare a win-win upgrading brief that names revenue, safety, sanitation, and climate benefits."
  ];

  if (score >= 65) {
    actions.unshift("Convene a rapid response circle with community leads, counsel, survey volunteers, and media reviewers.");
    actions.push("Draft injunction/petition materials for legal review and preserve original evidence offline.");
  }

  if (triggers.some((trigger) => trigger.id === "heavy-equipment")) {
    actions.push("Assign rotating observers to document equipment movement without confrontation.");
  }

  if (triggers.some((trigger) => trigger.id === "government-notice")) {
    actions.push("Request written basis, impact assessment, consultation record, relocation plan, and compensation framework.");
  }

  return actions;
}
