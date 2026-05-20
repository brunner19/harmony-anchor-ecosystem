import pilotCommunity from "../../data/pilot-community.json" with { type: "json" };
import { makeRecordId } from "../lib/hash.js";
import { todayIso } from "../lib/format.js";
import { analyzeThreat } from "./threat-sentinel.js";
import { createEvidenceFortressRecord } from "./evidence-fortress.js";
import { generateLegalPacket } from "./legal-oracle.js";
import { designUpgrade } from "./upgrade-designer.js";
import { simulateImpact } from "./impact-simulator.js";
import { generateAdvocacyPack } from "./advocacy-swarm.js";
import { coordinateResponse } from "./coordination-swarm.js";

export function runHarmonySwarm(input = {}) {
  const community = {
    ...pilotCommunity,
    ...(input.community || {})
  };
  const startedAt = todayIso();
  const threat = analyzeThreat({ ...input, community });
  const evidence = createEvidenceFortressRecord({
    ...input,
    community,
    evidence: input.evidence || community.sampleEvidence
  });
  const upgrade = designUpgrade({ ...input, community });
  const impact = simulateImpact({ ...input, community, upgrade });
  const legal = generateLegalPacket({
    ...input,
    community,
    threat,
    evidenceRecord: evidence.record,
    impact
  });
  const advocacy = generateAdvocacyPack({ ...input, community, threat, evidence: evidence.record, impact });
  const coordination = coordinateResponse({ ...input, community, threat, impact, upgrade });

  return {
    runId: makeRecordId("swarm"),
    startedAt,
    completedAt: todayIso(),
    mission:
      "Prevent forced eviction by converting threat evidence into a lawful, technical, economic, and public-interest upgrade path.",
    community,
    outputs: {
      threat,
      evidence,
      legal,
      upgrade,
      impact,
      advocacy,
      coordination
    },
    nextBestActions: [
      "Verify evidence and consent with community custodians.",
      "Ask qualified Nigerian counsel to review legal drafts before use.",
      "Request formal meeting with relevant public authorities using win-win framing.",
      "Replace concept cost model with locally surveyed bill-of-quantities data.",
      "Keep private household data separate from public advocacy material."
    ],
    humanReviewRequired: true
  };
}
