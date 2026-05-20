import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_STORE = {
  records: [],
  runs: [],
  createdAt: new Date().toISOString()
};

export function getDataDir() {
  return path.resolve(process.env.HARMONY_DATA_DIR || ".harmony-anchor");
}

export function getStorePath() {
  return path.join(getDataDir(), "store.json");
}

export async function readStore() {
  const storePath = getStorePath();
  try {
    const raw = await readFile(storePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { ...DEFAULT_STORE, createdAt: new Date().toISOString() };
  }
}

export async function writeStore(store) {
  const storePath = getStorePath();
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
  return store;
}

export async function appendRecord(record) {
  const store = await readStore();
  store.records = [record, ...(store.records || [])].slice(0, 250);
  store.updatedAt = new Date().toISOString();
  await writeStore(store);
  return record;
}

export async function appendRun(run) {
  const store = await readStore();
  store.runs = [run, ...(store.runs || [])].slice(0, 250);
  store.updatedAt = new Date().toISOString();
  await writeStore(store);
  return run;
}
