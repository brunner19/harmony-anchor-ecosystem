# Harmony Anchor Ecosystem

Harmony Anchor is an open-source, offline-first prototype for preventing forced evictions by turning community evidence into legal, technical, economic, and advocacy pathways for in-situ upgrading.

The first version starts with the PRD's Day 0-1 target: master orchestration, Threat Sentinel, and Evidence Fortress, plus the rest of the agent swarm as deterministic draft generators so a pilot team can test the end-to-end workflow immediately.

## What It Does

- Scores eviction risk from community reports, policy signals, GPS evidence, and satellite-style change indicators.
- Creates tamper-evident evidence bundles with SHA-256 hashes, IPFS CID previews, chain transaction previews, affidavit drafts, and digital twin summaries.
- Generates counsel-review legal packets for Lagos/Nigeria-focused action.
- Produces flood-safe upgrade concepts, phased budgets, BIM descriptions, and render prompts.
- Models upgrading versus demolition across cost, revenue, legal risk, social harm, and environmental outcomes.
- Builds respectful advocacy material and coordination task lists.
- Runs as a mobile-first web app with local offline packet storage and a service worker.

## Run Locally

No package install is required for the MVP.

```bash
cd /Users/verifier/Documents/nigeria-projects/harmony-anchor-ecosystem
node src/server.js
```

Open [http://localhost:8787](http://localhost:8787).

Run tests:

```bash
node --test test/*.test.js
```

## API

- `GET /api/health`
- `GET /api/community/demo`
- `GET /api/prompts`
- `GET /api/store`
- `POST /api/threat`
- `POST /api/evidence`
- `POST /api/swarm/run`

Example:

```bash
curl -s http://localhost:8787/api/swarm/run \
  -H 'content-type: application/json' \
  -d '{"situation":"Survey markers appeared, excavators nearby, no written notice."}'
```

## Repository Layout

- `src/agents/`: deterministic agent modules and prompt registry.
- `src/lib/`: local hash, store, formatting, and HTTP helpers.
- `public/`: mobile-first dashboard and offline service worker.
- `data/`: demo community and legal-source references.
- `docs/`: architecture, safety, roadmap, and agent operations.
- `test/`: Node test runner coverage and smoke scripts.

## Production Notes

This prototype does not provide legal advice, does not actually pin to IPFS, and does not submit transactions to a blockchain. It creates local proof previews so the pilot workflow can be validated before real evidence custody, counsel review, and community consent procedures are activated.

Core references to verify before live deployment:

- [UN Basic Principles and Guidelines on Development-Based Evictions and Displacement](https://www.ohchr.org/Documents/Issues/Housing/Guidelines_en.pdf)
- [African Charter on Human and Peoples' Rights](https://achpr.au.int/en/node/641)
- [Nigeria Land Use Act 1978 reference](https://www.oicrf.org/-/land-use-decree-1978)
- [Lagos State Urban and Regional Planning and Development Law 2010 PDF](https://epp.lagosstate.gov.ng/regulations/LSURPD_LAW_2010.pdf)

## License

MIT. Open-source forever.
