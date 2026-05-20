import { makeRecordId, pseudoChainTx, pseudoIpfsCid, sha256 } from "../lib/hash.js";
import { todayIso } from "../lib/format.js";

export function createEvidenceFortressRecord(input = {}) {
  const community = input.community || {};
  const uploads = input.uploads || input.evidence || community.sampleEvidence || [];
  const now = todayIso();
  const recordId = makeRecordId("evidence");

  const artifacts = uploads.map((upload, index) => {
    const metadata = {
      index,
      type: upload.type || "unknown",
      filename: upload.filename || `artifact-${index + 1}`,
      timestamp: upload.timestamp || now,
      gps: upload.gps || input.gps || community.coordinates || null,
      description: upload.description || "Community-submitted artifact",
      submittedBy: upload.submittedBy || "withheld"
    };
    return {
      ...metadata,
      contentHash: sha256(upload.content || upload.description || metadata),
      metadataHash: sha256(metadata)
    };
  });

  const populationEstimate = input.populationEstimate || community.estimatedResidents || estimatePopulation(artifacts);
  const structureEstimate = input.structureEstimate || community.structures || Math.max(artifacts.length * 12, 1);

  const digitalTwin = {
    summary: `${community.name || "Community"} digital twin draft with ${structureEstimate} mapped structures and approximately ${populationEstimate} residents.`,
    coordinateSystem: "WGS84",
    centroid: community.coordinates || input.gps || null,
    footprintMap: buildFootprintMap(structureEstimate, community.coordinates || input.gps),
    layoutDescription: buildLayoutDescription(community, structureEstimate),
    limitations: [
      "Computer vision and survey outputs must be validated by trained community mappers.",
      "No biometric inference is performed.",
      "Precise household identities are excluded from public summaries by default."
    ]
  };

  const record = {
    recordId,
    createdAt: now,
    communityId: community.communityId || input.communityId || "unassigned",
    artifacts,
    digitalTwin,
    hashes: {
      bundleHash: sha256({ artifacts, digitalTwin, createdAt: now }),
      ipfsCidPreview: pseudoIpfsCid({ artifacts, digitalTwin }),
      chainTxPreview: pseudoChainTx({ artifacts, digitalTwin })
    },
    consent: input.consent || {
      scope: "local evidence preparation",
      publicSharing: false,
      legalSharing: "requires human approval"
    }
  };

  return {
    agent: "Evidence Fortress",
    record,
    markdownReport: renderEvidenceReport(record, community),
    affidavitTemplate: renderAffidavit(record, community)
  };
}

function estimatePopulation(artifacts) {
  return Math.max(artifacts.length * 35, 35);
}

function buildFootprintMap(structureEstimate, centroid) {
  const count = Math.min(Number(structureEstimate) || 1, 20);
  return Array.from({ length: count }, (_, index) => {
    const offset = index - Math.floor(count / 2);
    return {
      id: `structure-${String(index + 1).padStart(3, "0")}`,
      use: index % 9 === 0 ? "community asset" : "residential or mixed use",
      confidence: index < 5 ? "medium" : "draft",
      centroid: centroid
        ? {
            lat: Number((centroid.lat + offset * 0.00008).toFixed(6)),
            lng: Number((centroid.lng + (index % 4) * 0.00008).toFixed(6))
          }
        : null
    };
  });
}

function buildLayoutDescription(community, structureEstimate) {
  const flood = community.upgradeConstraints?.floodRisk;
  const assets = community.upgradeConstraints?.priorityAssets || [];
  return [
    `${structureEstimate} structures represented as a draft participatory footprint layer.`,
    flood ? `Flood context flagged as ${flood}; upgrade plan should prioritize raised walkways, sanitation, drainage, and safe egress.` : null,
    assets.length ? `Priority assets to preserve or add: ${assets.join(", ")}.` : null,
    "3D/BIM handoff: model timber/stilt foundations, modular service cores, circulation routes, clinic/school nodes, and phased relocation buffers."
  ]
    .filter(Boolean)
    .join(" ");
}

function renderEvidenceReport(record, community) {
  return `# Evidence Fortress Report

Community: ${community.name || record.communityId}
Record ID: ${record.recordId}
Created: ${record.createdAt}

## Tamper-Evident Bundle

- Bundle hash: \`${record.hashes.bundleHash}\`
- IPFS CID preview: \`${record.hashes.ipfsCidPreview}\`
- Chain transaction preview: \`${record.hashes.chainTxPreview}\`

These are local proof previews. Production deployments should pin to IPFS/Filecoin or equivalent storage and anchor the bundle hash on a low-cost public chain only after community consent and legal review.

## Digital Twin Summary

${record.digitalTwin.summary}

${record.digitalTwin.layoutDescription}

## Artifact Register

${record.artifacts
  .map(
    (artifact) =>
      `- ${artifact.type}: ${artifact.description} (${artifact.timestamp}); metadata hash \`${artifact.metadataHash}\``
  )
  .join("\n")}

## Court-Readiness Checklist

- Preserve original files on at least two offline devices.
- Keep witness consent and chain-of-custody notes separate from public evidence.
- Confirm GPS/time metadata before filing.
- Have counsel review any affidavit before submission.
`;
}

function renderAffidavit(record, community) {
  return `# Draft Affidavit Template

I, ______________________, of ${community.name || "the affected community"}, state as follows:

1. I am a resident, representative, mapper, or authorized witness with personal knowledge of the facts described below.
2. On or about ${record.createdAt}, the attached evidence bundle was prepared for the purpose of documenting community presence, structures, services, and potential eviction risk.
3. The evidence register contains ${record.artifacts.length} artifact(s). The bundle hash is ${record.hashes.bundleHash}.
4. To the best of my knowledge, the artifacts are true records of the location, time, and circumstances described in the evidence register.
5. I understand this draft must be reviewed by qualified counsel before filing or service.

Signed: ______________________
Date: ______________________
`;
}
