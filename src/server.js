import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pilotCommunity from "../data/pilot-community.json" with { type: "json" };
import legalSources from "../data/legal-sources.json" with { type: "json" };
import { readJsonRequest, sendError, sendJson, sendStatic } from "./lib/http.js";
import { appendRecord, appendRun, readStore } from "./lib/store.js";
import { getPromptRegistry } from "./agents/prompts.js";
import { analyzeThreat } from "./agents/threat-sentinel.js";
import { createEvidenceFortressRecord } from "./agents/evidence-fortress.js";
import { runHarmonySwarm } from "./agents/orchestrator.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");
const port = Number(process.env.PORT || 8787);

export function createApp() {
  return async function app(request, response) {
    try {
      const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

      if (request.method === "GET" && url.pathname === "/api/health") {
        return sendJson(response, 200, {
          ok: true,
          service: "harmony-anchor-ecosystem",
          version: "0.1.0",
          time: new Date().toISOString()
        });
      }

      if (request.method === "GET" && url.pathname === "/api/community/demo") {
        return sendJson(response, 200, pilotCommunity);
      }

      if (request.method === "GET" && url.pathname === "/api/legal-sources") {
        return sendJson(response, 200, legalSources);
      }

      if (request.method === "GET" && url.pathname === "/api/prompts") {
        return sendJson(response, 200, getPromptRegistry());
      }

      if (request.method === "GET" && url.pathname === "/api/store") {
        return sendJson(response, 200, await readStore());
      }

      if (request.method === "POST" && url.pathname === "/api/threat") {
        const body = await readJsonRequest(request);
        return sendJson(response, 200, analyzeThreat({ community: pilotCommunity, ...body }));
      }

      if (request.method === "POST" && url.pathname === "/api/evidence") {
        const body = await readJsonRequest(request);
        const evidence = createEvidenceFortressRecord({ community: pilotCommunity, ...body });
        await appendRecord(evidence.record);
        return sendJson(response, 201, evidence);
      }

      if (request.method === "POST" && url.pathname === "/api/swarm/run") {
        const body = await readJsonRequest(request);
        const run = runHarmonySwarm(body);
        await appendRun({
          runId: run.runId,
          createdAt: run.completedAt,
          communityId: run.community.communityId,
          riskScore: run.outputs.threat.riskScore,
          level: run.outputs.threat.level,
          evidenceBundleHash: run.outputs.evidence.record.hashes.bundleHash,
          summary: run.mission
        });
        await appendRecord(run.outputs.evidence.record);
        return sendJson(response, 201, run);
      }

      const served = request.method === "GET" && (await sendStatic(response, publicDir, url.pathname));
      if (served) return;

      sendJson(response, 404, {
        error: "Not found",
        endpoints: [
          "GET /api/health",
          "GET /api/community/demo",
          "GET /api/prompts",
          "GET /api/store",
          "POST /api/threat",
          "POST /api/evidence",
          "POST /api/swarm/run"
        ]
      });
    } catch (error) {
      sendError(response, error);
    }
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = http.createServer(createApp());
  server.listen(port, () => {
    console.log(`Harmony Anchor running at http://localhost:${port}`);
  });
}
