export function coordinateResponse(input = {}) {
  const community = input.community || {};
  const threat = input.threat || {};
  const needs = input.needs || community.upgradeConstraints?.priorityAssets || [];
  const riskLevel = threat.level || "watch";

  return {
    agent: "Coordination Swarm",
    operatingMode: riskLevel === "critical" || riskLevel === "high" ? "rapid-response" : "preparedness",
    matchedResourceTypes: [
      {
        role: "Community legal counsel",
        matchCriteria: "Lagos land, planning, fundamental rights, injunction, and evidence review experience",
        firstTask: "Review petition, injunction skeleton, evidence hashes, and notice status."
      },
      {
        role: "Participatory mapping lead",
        matchCriteria: "OSM, GPS collection, consent-based household mapping, offline data capture",
        firstTask: "Validate structure footprints and produce public/private map layers."
      },
      {
        role: "Architect/engineer team",
        matchCriteria: "Flood-safe, informal settlement upgrading, sanitation, fire access, modular construction",
        firstTask: "Validate Phase 1 no-regrets infrastructure and permit path."
      },
      {
        role: "Media and civic communications reviewer",
        matchCriteria: "Rights-based messaging, anti-retaliation practice, source verification",
        firstTask: "Review public statements and redact sensitive identities."
      },
      {
        role: "Funding and cooperative finance partner",
        matchCriteria: "Community infrastructure finance, grants, ESG, social impact, cooperative revenue",
        firstTask: "Turn impact model into a first financing memo."
      }
    ],
    taskAssignments: [
      { owner: "Community leads", task: "Confirm consent process and choose evidence custodians.", due: "24 hours" },
      { owner: "Legal team", task: "Verify notice status and legal basis request.", due: "24-48 hours" },
      { owner: "Mapping team", task: "Validate GPS points and structure counts.", due: "72 hours" },
      { owner: "Design team", task: `Draft Phase 1 plan for ${needs.slice(0, 3).join(", ") || "priority infrastructure"}.`, due: "5 days" },
      { owner: "Advocacy team", task: "Prepare respectful outreach pack for officials and partners.", due: "48 hours" }
    ],
    collaborationChannels: [
      "Private evidence custody group",
      "Community announcement channel in preferred local language",
      "Counsel-reviewed document folder",
      "Technical upgrade workspace",
      "Public-safe media folder"
    ],
    dashboardUpdates: [
      `Risk mode set to ${riskLevel}.`,
      "Evidence bundle requires human verification before public release.",
      "Legal, design, impact, advocacy, and coordination packs generated as drafts."
    ]
  };
}
