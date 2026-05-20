export function generateAdvocacyPack(input = {}) {
  const community = input.community || {};
  const threat = input.threat || {};
  const impact = input.impact || {};
  const name = community.name || "the community";
  const risk = threat.riskScore ?? "pending";

  return {
    agent: "Advocacy Swarm",
    tone: "respectful, factual, urgent, and win-win",
    pressRelease: `# Draft Press Release

${name} residents and partners are calling for a lawful, participatory upgrading process after early warning indicators showed an eviction risk score of ${risk}/100.

The community is not asking government to ignore planning, safety, or environmental priorities. Residents are asking for the safer and more economically rational path: disclose the legal basis, consult affected families, preserve evidence, and evaluate an in-situ upgrade that can improve sanitation, flood resilience, public revenue, and livelihoods without forced displacement.

Harmony Anchor's preliminary impact model estimates that upgrading can protect ${impact.economicModel?.upgrading?.peopleProtected ?? community.estimatedResidents ?? "many"} residents while reducing litigation, emergency relief, and reputational risk. All data should be verified with community leaders, technical experts, and qualified counsel before public release.`,
    videoScripts: {
      short: "Opening shot: raised walkways, homes, children going to school. Voiceover: 'A city does not become safer by erasing its people. Makoko can be upgraded, documented, and made flood-resilient without forced eviction.' End card: 'Pause demolition. Share the plan. Upgrade with dignity.'",
      long: "Scene 1: residents describe homes and livelihoods. Scene 2: evidence map shows public-interest facts without exposing private identities. Scene 3: engineer explains sanitation, walkway, and flood-safe modules. Scene 4: official-facing economics compare upgrading against demolition costs. Close: 'This is not resistance to progress. This is the blueprint for progress that includes everyone.'"
    },
    targetedMessages: [
      {
        audience: "Government",
        message:
          "A participatory upgrade gives the state safer infrastructure, better data, future revenue, reduced litigation risk, and a credible public-interest success story."
      },
      {
        audience: "Developers and investors",
        message:
          "A negotiated upgrade lowers project conflict, improves ESG credibility, and creates bankable infrastructure and mixed-use opportunities without displacement backlash."
      },
      {
        audience: "NGOs and legal partners",
        message:
          "The evidence bundle, legal checklist, and impact model are ready for verification, counsel review, and coordinated rights-based action."
      },
      {
        audience: "Media",
        message:
          "The story is not only demolition risk; it is a practical, costed alternative that protects lives and gives public officials a better option."
      }
    ],
    petitionText: `We ask relevant authorities to pause any demolition or forced removal affecting ${name}, disclose the legal and planning basis for proposed action, conduct meaningful consultation, and evaluate an in-situ upgrading plan that protects residents while delivering safer infrastructure, sanitation, climate resilience, and public value.`,
    emailTemplate: `Subject: Request for lawful consultation and in-situ upgrading review for ${name}

Dear [Official/Partner],

We respectfully request your urgent support for a constructive resolution at ${name}. Residents and partners seek a lawful, transparent process that prevents forced eviction and prioritizes safety, sanitation, flood resilience, and public value.

Please share any written notices, legal basis, impact assessments, consultation records, relocation or compensation plans, and available channels for technical dialogue. We are ready to review an in-situ upgrading proposal with government, community representatives, and qualified experts.

Respectfully,
[Name / Organization]`,
    sharePackage: [
      "Evidence Fortress summary with public-safe redactions",
      "One-page upgrading versus demolition comparison",
      "Legal review checklist",
      "Resident quote bank with consent status",
      "Official meeting request email"
    ]
  };
}
