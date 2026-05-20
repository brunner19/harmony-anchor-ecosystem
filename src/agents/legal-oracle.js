import legalSources from "../../data/legal-sources.json" with { type: "json" };

export function generateLegalPacket(input = {}) {
  const community = input.community || {};
  const threat = input.threat || {};
  const evidence = input.evidenceRecord || {};
  const location = [community.localGovernmentArea, community.state, community.country].filter(Boolean).join(", ");

  return {
    agent: "Legal Oracle",
    jurisdiction: {
      primary: "Nigeria",
      focus: "Lagos State",
      location: location || "Unspecified"
    },
    disclaimer:
      "Draft legal-support materials for review by qualified Nigerian counsel. This is not legal advice and should not be filed without human legal review.",
    draftDocuments: {
      injunction: renderInjunctionDraft(community, threat, evidence),
      petition: renderPetitionDraft(community, threat),
      memorandumOfUnderstanding: renderMouDraft(community)
    },
    complianceChecklist: [
      "Confirm whether any written notice has been served and preserve copies.",
      "Request legal authority, project purpose, impact assessment, consultation record, relocation plan, and compensation framework.",
      "Check Land Use Act revocation and compensation requirements with counsel.",
      "Check Lagos planning/building-control procedures and any demolition notice requirements with counsel.",
      "Map vulnerable residents, children, schools, clinics, livelihoods, and disability needs for impact assessment.",
      "Prepare a negotiated upgrading alternative before adversarial escalation where safe.",
      "Avoid public release of names, precise household locations, or child data without consent."
    ],
    citations: legalSources,
    negotiationScript: [
      "We are asking for lawful, documented, consultative upgrading because it protects residents while giving government a faster path to safer infrastructure and public revenue.",
      "A forced demolition creates litigation risk, emergency-relief costs, negative media, and loss of livelihoods; a phased upgrade creates sanitation, tax-base, climate, and service-delivery wins.",
      "Please provide the written basis for any proposed action, the consultation record, the impact assessment, and the relocation or upgrading plan so all parties can resolve this constructively."
    ]
  };
}

function renderInjunctionDraft(community, threat, evidence) {
  return `# Draft Motion / Injunction Skeleton

**For counsel review before use**

## Parties

Applicants: Representatives of ${community.name || "the affected community"} and affected residents.

Respondents: Relevant state, local government, agency, developer, or enforcement body to be identified by counsel.

## Urgent Grounds

1. Residents report credible indicators of forced eviction risk, currently scored by Harmony Anchor as ${threat.riskScore ?? "unscored"}/100 (${threat.level || "pending"}).
2. Community evidence has been preserved in a tamper-evident bundle${evidence.hashes?.bundleHash ? ` with hash ${evidence.hashes.bundleHash}` : ""}.
3. No adequate written notice, consultation record, impact assessment, compensation framework, or relocation/upgrading plan has been verified in the system record.
4. Demolition without due process would risk irreparable harm to housing, livelihood, schooling, health, and community life.

## Relief Requested

- Interim order preserving the status quo pending hearing.
- Order restraining demolition, forced removal, intimidation, or destruction of property without lawful process.
- Order requiring disclosure of project authority, notices, impact assessments, consultation records, and relocation/compensation plan.
- Direction for parties to enter supervised consultation on in-situ upgrading or safe phased alternatives.

## Evidence Attachments

- Evidence Fortress report.
- Witness statements and consent logs.
- Photos, videos, GPS records, survey map, and chain-of-custody notes.
- Impact Simulator comparison of upgrading versus demolition.
`;
}

function renderPetitionDraft(community, threat) {
  return `# Draft Petition to Public Authorities

To: Relevant Lagos State and Local Government Authorities

We write on behalf of ${community.name || "affected residents"} to request immediate written clarification and constructive engagement regarding reported eviction and demolition indicators.

Residents seek a lawful, transparent, win-win upgrading process. The current risk score is ${threat.riskScore ?? "pending"}/100, with triggers including ${(threat.triggers || []).map((trigger) => trigger.label).join(", ") || "items requiring verification"}.

We respectfully request:

1. The legal and planning basis for any proposed action.
2. Copies of notices, impact assessments, environmental and social safeguards, and consultation records.
3. A halt to demolition or forced movement unless and until lawful process, meaningful consultation, remedies, and safe alternatives are complete.
4. A joint technical meeting to assess in-situ upgrading, flood-safe infrastructure, sanitation, revenue, and service-delivery options.

This approach protects residents, reduces litigation and emergency-relief costs, improves public health, and gives government a credible public-interest success story.
`;
}

function renderMouDraft(community) {
  return `# Draft Upgrading Memorandum of Understanding

Parties: Community representatives of ${community.name || "the settlement"}, relevant public agencies, technical partners, funders, and implementation partners.

## Shared Goal

Deliver safe, lawful, climate-resilient upgrading without forced eviction.

## Commitments

- Community: support participatory mapping, safety verification, maintenance planning, and conflict-sensitive communication.
- Government: pause demolition actions, share planning data, provide permits/technical review, and support service connections.
- Technical partners: produce safety, sanitation, flood, structural, and cost plans.
- Funders/developers: evaluate bankable, inclusive upgrade options before displacement or clearance.

## Safeguards

- No forced movement without lawful process, informed consultation, remedies, and safe alternatives.
- Data sharing is opt-in, minimal, and purpose-bound.
- Children and vulnerable residents receive additional protection.
`;
}
