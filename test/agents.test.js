import test from "node:test";
import assert from "node:assert/strict";
import pilotCommunity from "../data/pilot-community.json" with { type: "json" };
import { analyzeThreat } from "../src/agents/threat-sentinel.js";
import { createEvidenceFortressRecord } from "../src/agents/evidence-fortress.js";
import { runHarmonySwarm } from "../src/agents/orchestrator.js";

test("Threat Sentinel raises risk for equipment and notice signals", () => {
  const result = analyzeThreat({
    community: pilotCommunity,
    situation: "Excavators, police, survey markers, and quit notice rumors are present."
  });

  assert.equal(result.agent, "Threat Sentinel");
  assert.ok(result.riskScore >= 65);
  assert.ok(result.triggers.length >= 3);
  assert.match(result.timeline, /week|days/i);
});

test("Evidence Fortress creates stable hash previews and affidavit draft", () => {
  const result = createEvidenceFortressRecord({ community: pilotCommunity });

  assert.equal(result.agent, "Evidence Fortress");
  assert.equal(result.record.artifacts.length, pilotCommunity.sampleEvidence.length);
  assert.match(result.record.hashes.bundleHash, /^[a-f0-9]{64}$/);
  assert.match(result.record.hashes.ipfsCidPreview, /^ipfs:\/\//);
  assert.match(result.affidavitTemplate, /Draft Affidavit Template/);
});

test("Full swarm returns all PRD agents and requires human review", () => {
  const result = runHarmonySwarm({
    situation: "Survey markers appeared. Excavators nearby. No written notice."
  });

  assert.equal(result.humanReviewRequired, true);
  assert.ok(result.outputs.threat);
  assert.ok(result.outputs.evidence);
  assert.ok(result.outputs.legal);
  assert.ok(result.outputs.upgrade);
  assert.ok(result.outputs.impact);
  assert.ok(result.outputs.advocacy);
  assert.ok(result.outputs.coordination);
});
