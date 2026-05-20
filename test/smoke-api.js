const baseUrl = process.env.HARMONY_BASE_URL || "http://localhost:8787";

const health = await fetch(`${baseUrl}/api/health`).then((response) => response.json());
const run = await fetch(`${baseUrl}/api/swarm/run`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    situation: "Survey markers appeared, excavators nearby, no written notice or relocation plan."
  })
}).then((response) => response.json());

console.log(
  JSON.stringify(
    {
      health,
      runId: run.runId,
      riskScore: run.outputs.threat.riskScore,
      evidenceHash: run.outputs.evidence.record.hashes.bundleHash
    },
    null,
    2
  )
);
