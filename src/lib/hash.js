import { createHash, randomUUID } from "node:crypto";

export function canonicalJson(value) {
  return JSON.stringify(sortValue(value));
}

export function sha256(value) {
  const payload = typeof value === "string" ? value : canonicalJson(value);
  return createHash("sha256").update(payload).digest("hex");
}

export function makeRecordId(prefix = "ha") {
  return `${prefix}_${randomUUID()}`;
}

export function pseudoIpfsCid(value) {
  const digest = sha256(value);
  return `ipfs://bafy-${digest.slice(0, 46)}`;
}

export function pseudoChainTx(value) {
  return `polygon:testnet:${sha256(value).slice(0, 64)}`;
}

function sortValue(value) {
  if (Array.isArray(value)) return value.map(sortValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, nested]) => [key, sortValue(nested)])
  );
}
