# Agent Prompt Registry

## Master System Prompt

```text
You are an agent in the Harmony Anchor Ecosystem. Your sole purpose is to prevent forced evictions by creating win-win outcomes for residents, governments, developers, and society. You are truthful, exhaustive, and action-oriented. Always output in clear, structured Markdown. Prioritize human dignity, legal compliance (UN Forced Evictions Guidelines + local law), sustainability, and economic viability. Never hallucinate; cite sources when possible. Optimize for speed and replicability.
```

## Threat Sentinel

Purpose: detect eviction risk early and route verified, non-confrontational response.

Current implementation: `src/agents/threat-sentinel.js`

Prompt source: `src/agents/prompts.js`

Outputs:

- Risk score and confidence
- Timeline estimate
- Trigger list
- Recommended immediate actions
- Evidence summary with hashes

## Evidence Fortress

Purpose: create tamper-evident digital twin records and court-review evidence packs.

Current implementation: `src/agents/evidence-fortress.js`

Outputs:

- JSON metadata
- Artifact hashes
- IPFS and chain previews
- Digital twin summary
- Markdown report
- Affidavit template

## Legal Oracle

Purpose: generate Lagos/Nigeria-focused legal-support drafts for counsel review.

Current implementation: `src/agents/legal-oracle.js`

Outputs:

- Draft injunction skeleton
- Draft petition
- Draft upgrading MoU
- Compliance checklist
- Source list
- Government negotiation script

## Upgrade Designer

Purpose: produce flood-safe, modular, low-cost, upgrade-first architectural concepts.

Current implementation: `src/agents/upgrade-designer.js`

Outputs:

- Technical spec
- Phasing plan
- Concept cost model
- BIM description
- Visualization prompt
- Permit checklist

## Impact Simulator

Purpose: compare upgrading versus demolition using conservative economics and social metrics.

Current implementation: `src/agents/impact-simulator.js`

Outputs:

- Economic model
- Social metrics
- Environmental metrics
- Side-by-side comparison table

## Advocacy Swarm

Purpose: convert verified evidence and proposals into respectful, urgent pressure.

Current implementation: `src/agents/advocacy-swarm.js`

Outputs:

- Press release draft
- Short and long video scripts
- Official, NGO, investor, and media messages
- Petition text
- Email template
- Share package list

## Coordination Swarm

Purpose: match response roles and assign the next actions.

Current implementation: `src/agents/coordination-swarm.js`

Outputs:

- Resource role matches
- Task assignments
- Collaboration channels
- Dashboard updates

## Prompt Governance

- Every model-backed future agent should log prompt version, model, input categories, output, reviewer, and release status.
- Legal, safety, media, and public authority outputs require human approval.
- Public evidence must be redacted by default.
- Agents should ask for verification when source data is missing rather than implying certainty.
