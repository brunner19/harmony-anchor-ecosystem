import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createApp } from "../src/server.js";

test("health endpoint responds", async () => {
  const { baseUrl, close } = await startServer();
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    const json = await response.json();
    assert.equal(response.status, 200);
    assert.equal(json.ok, true);
  } finally {
    await close();
  }
});

test("swarm endpoint returns a generated packet", async () => {
  const { baseUrl, close } = await startServer();
  try {
    const response = await fetch(`${baseUrl}/api/swarm/run`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ situation: "Demolition notice rumors and excavators nearby." })
    });
    const json = await response.json();
    assert.equal(response.status, 201);
    assert.ok(json.runId);
    assert.ok(json.outputs.threat.riskScore > 0);
    assert.ok(json.outputs.evidence.record.hashes.bundleHash);
  } finally {
    await close();
  }
});

async function startServer() {
  const server = http.createServer(createApp());
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  };
}
