# Architecture

## System Shape

Harmony Anchor is built as a supervised agent swarm. The MVP is deterministic and local-first so community teams can audit every output before connecting external LLMs, IPFS pinning, blockchain anchoring, SMS, WhatsApp, satellite providers, or cloud databases.

## Components

- Mobile-first dashboard: voice note capture where browser support exists, quick risk-signal buttons, offline packet storage, and generated response packet.
- Workflow API: local Node HTTP service exposing health, demo data, prompt registry, evidence, threat, store, and full swarm endpoints.
- Agent swarm: Threat Sentinel, Evidence Fortress, Legal Oracle, Upgrade Designer, Impact Simulator, Advocacy Swarm, and Coordination Swarm.
- Data store: local JSON append store in `.harmony-anchor/store.json` for recent runs and evidence records.
- Evidence layer: SHA-256 hashes, canonical JSON, local IPFS CID previews, and chain transaction previews.

## Data Flow

1. A resident, mapper, NGO, or staff user records threat notes and evidence metadata.
2. Threat Sentinel scores the risk and recommends immediate actions.
3. Evidence Fortress creates a tamper-evident bundle, digital twin summary, artifact register, and affidavit template.
4. Legal Oracle drafts petition, injunction skeleton, MoU, compliance checklist, negotiation script, and source list for counsel review.
5. Upgrade Designer creates the in-situ upgrade plan, cost concept, BIM description, visualization prompt, and permit checklist.
6. Impact Simulator compares upgrading with demolition using conservative assumptions.
7. Advocacy Swarm turns verified facts into respectful public and stakeholder messages.
8. Coordination Swarm assigns work to legal, mapping, design, funding, and communications roles.

## Production Integrations

- Frontend: replace or extend the current web PWA with Flutter or React Native.
- Messaging: add Twilio, WhatsApp Business API, or local SMS gateways for fallback intake.
- Orchestration: wrap agent modules with LangGraph once live model/tool calls are approved.
- Storage: Supabase/PostgreSQL for metadata, local SQLite on devices, encrypted object storage for private evidence.
- Evidence custody: IPFS/Filecoin or equivalent pinning plus Polygon or low-cost public chain anchoring.
- Mapping: OpenStreetMap, Mapbox/Leaflet, Google Earth Engine, Sentinel-2, and community participatory mapping.
- Authentication: role-based access, consent scopes, private/public evidence partitions, and audit logs.

## Safety Controls

- Human review is required for legal, public, safety-critical, and high-impact outputs.
- Household identities and precise private locations should be separated from public advocacy packs.
- AI outputs must be labeled as drafts until approved.
- Emergency response and legal filing cannot be automated.
- Consent scope must be checked before sharing evidence with lawyers, media, public officials, or funders.

## Deployment

The MVP runs with plain Node. The included Dockerfile can be deployed to any container host.

```bash
docker build -t harmony-anchor .
docker run -p 8787:8787 harmony-anchor
```
