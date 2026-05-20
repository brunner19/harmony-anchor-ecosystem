const state = {
  community: null,
  latestRun: null,
  packetSections: null,
  activePacket: "full"
};

const els = {
  communityName: document.querySelector("#communityName"),
  situation: document.querySelector("#situation"),
  runSwarm: document.querySelector("#runSwarm"),
  saveOffline: document.querySelector("#saveOffline"),
  newIncident: document.querySelector("#newIncident"),
  openCounselMemo: document.querySelector("#openCounselMemo"),
  copyPacket: document.querySelector("#copyPacket"),
  voiceButton: document.querySelector("#voiceButton"),
  questionSteps: document.querySelectorAll(".question-step"),
  questionPrompt: document.querySelector("#questionPrompt"),
  packetTabs: document.querySelectorAll("[data-packet]"),
  connectionStatus: document.querySelector("#connectionStatus"),
  riskScore: document.querySelector("#riskScore"),
  riskLevel: document.querySelector("#riskLevel"),
  riskArc: document.querySelector("#riskArc"),
  timeline: document.querySelector("#timeline"),
  confidence: document.querySelector("#confidence"),
  evidenceCueList: document.querySelector("#evidenceCueList"),
  residentCount: document.querySelector("#residentCount"),
  artifactCount: document.querySelector("#artifactCount"),
  reviewStatus: document.querySelector("#reviewStatus"),
  threatList: document.querySelector("#threatList"),
  legalList: document.querySelector("#legalList"),
  evidenceSummary: document.querySelector("#evidenceSummary"),
  upgradeSummary: document.querySelector("#upgradeSummary"),
  impactTable: document.querySelector("#impactTable"),
  taskList: document.querySelector("#taskList"),
  responseTimeline: document.querySelector("#responseTimeline"),
  packetOutput: document.querySelector("#packetOutput")
};

bootstrap();

async function bootstrap() {
  bindEvents();
  await loadCommunity();
  restoreOfflinePacket();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
  updateConnection();
  window.addEventListener("online", updateConnection);
  window.addEventListener("offline", updateConnection);
}

function bindEvents() {
  els.questionSteps.forEach((button) => {
    button.addEventListener("click", () => {
      els.questionSteps.forEach((step) => step.classList.remove("is-active"));
      button.classList.add("is-active");
      els.questionPrompt.textContent = button.dataset.question;
      els.situation.focus();
    });
  });

  els.packetTabs.forEach((button) => {
    button.addEventListener("click", () => {
      selectPacket(button.dataset.packet);
    });
  });

  document.querySelectorAll("[data-signal]").forEach((button) => {
    button.addEventListener("click", () => {
      els.situation.value = `${els.situation.value.trim()}\n${button.dataset.signal}`.trim();
    });
  });

  els.runSwarm.addEventListener("click", runSwarm);
  els.saveOffline.addEventListener("click", saveOffline);
  els.newIncident.addEventListener("click", startNewIncident);
  els.openCounselMemo.addEventListener("click", openCounselMemo);
  els.copyPacket.addEventListener("click", copyPacket);
  els.voiceButton.addEventListener("click", captureVoiceNote);
}

async function loadCommunity() {
  try {
    state.community = await getJson("/api/community/demo");
    els.communityName.textContent = state.community.name;
  } catch {
    state.community = JSON.parse(localStorage.getItem("harmony-community") || "null");
    els.communityName.textContent = state.community?.name || "Offline community packet";
  }

  if (state.community) {
    localStorage.setItem("harmony-community", JSON.stringify(state.community));
  }
}

async function runSwarm() {
  setBusy(true);
  try {
    const payload = {
      community: state.community,
      situation: els.situation.value,
      evidence: state.community?.sampleEvidence || []
    };
    const run = await postJson("/api/swarm/run", payload);
    state.latestRun = run;
    localStorage.setItem("harmony-latest-run", JSON.stringify(run));
    renderRun(run);
    els.connectionStatus.textContent = "Packet generated";
  } catch (error) {
    els.packetOutput.textContent = `Could not run swarm online. Offline packet preserved.\n\n${error.message}`;
  } finally {
    setBusy(false);
  }
}

function renderRun(run) {
  const { threat, evidence, legal, upgrade, impact, advocacy, coordination } = run.outputs;
  setRisk(threat.riskScore, threat.level);
  els.timeline.textContent = threat.timeline;
  els.confidence.textContent = `Confidence: ${threat.confidence}. Human review required before action.`;
  els.residentCount.textContent = new Intl.NumberFormat("en").format(run.community.estimatedResidents || 0);
  els.artifactCount.textContent = `${evidence.record.artifacts.length} artifacts`;
  els.reviewStatus.textContent = run.humanReviewRequired ? "Counsel" : "Ready";
  renderList(
    els.threatList,
    threat.triggers.length
      ? threat.triggers.map((trigger) => `${trigger.label}: ${trigger.matchedSignals.join(", ")}`)
      : ["No urgent trigger detected; continue monitoring."]
  );
  els.evidenceSummary.textContent = `Bundle ${evidence.record.hashes.bundleHash.slice(0, 18)}... with ${evidence.record.artifacts.length} artifact(s), ${evidence.record.digitalTwin.footprintMap.length} draft footprint entries, and local IPFS/chain previews.`;
  renderEvidenceCues(evidence.record.artifacts, evidence.record.consent);
  renderList(els.legalList, legal.complianceChecklist.slice(0, 5));
  els.upgradeSummary.textContent = `${upgrade.designName}. ${upgrade.phases[0].name} starts ${upgrade.phases[0].duration}; concept budget ${upgrade.costEstimate.lines.map((line) => `${line.item}: ${line.display}`).slice(0, 2).join(", ")}.`;
  renderImpact(impact.comparisonTable);
  renderList(els.taskList, coordination.taskAssignments.map((task) => `${task.owner}: ${task.task} (${task.due})`));
  renderResponseTimeline(run.nextBestActions);
  state.packetSections = renderPacketSections({ run, threat, evidence, legal, upgrade, impact, advocacy, coordination });
  renderActivePacket();
}

function renderList(container, items) {
  container.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    container.append(li);
  });
}

function renderEvidenceCues(artifacts, consent = {}) {
  const cues = [
    `${artifacts.length} artifact${artifacts.length === 1 ? "" : "s"} hashed`,
    consent.publicSharing ? "Public sharing allowed" : "Public summary locked",
    consent.legalSharing || "Legal sharing requires approval"
  ];
  els.evidenceCueList.replaceChildren(
    ...cues.map((cue) => {
      const span = document.createElement("span");
      span.textContent = cue;
      return span;
    })
  );
}

function renderResponseTimeline(actions = []) {
  const phases = ["T+0", "T+6h", "T+24h", "T+48h", "T+72h"];
  const visibleActions = actions.slice(0, 5);
  els.responseTimeline.replaceChildren(
    ...visibleActions.map((action, index) => {
      const li = document.createElement("li");
      li.dataset.phase = phases[index] || `T+${index}`;
      li.textContent = action;
      return li;
    })
  );
}

function renderImpact(rows) {
  const table = document.createElement("table");
  table.className = "metric-table";
  table.innerHTML = "<thead><tr><th>Metric</th><th>Upgrade</th><th>Demolition</th></tr></thead>";
  const body = document.createElement("tbody");
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${escapeHtml(row.metric)}</td><td>${escapeHtml(row.upgrading)}</td><td>${escapeHtml(row.demolition)}</td>`;
    body.append(tr);
  });
  table.append(body);
  els.impactTable.replaceChildren(table);
}

function setRisk(score, level) {
  const arcLength = 427;
  const offset = arcLength - (arcLength * Number(score || 0)) / 100;
  els.riskScore.textContent = score;
  els.riskLevel.textContent = level;
  els.riskArc.style.strokeDashoffset = offset;
  els.riskArc.style.stroke = score >= 80 ? "#b65434" : score >= 60 ? "#c9932d" : "#14716d";
}

function renderPacket({ run, threat, evidence, legal, upgrade, impact, advocacy, coordination }) {
  return renderPacketSections({ run, threat, evidence, legal, upgrade, impact, advocacy, coordination }).full;
}

function renderPacketSections({ run, threat, evidence, legal, upgrade, impact, advocacy, coordination }) {
  const risk = `## Risk

Score: ${threat.riskScore}/100 (${threat.level})
Confidence: ${threat.confidence}
Timeline: ${threat.timeline}

Immediate actions:
${threat.recommendedImmediateActions.map((item) => `- ${item}`).join("\n")}`;

  const evidenceSection = `## Evidence

Bundle hash: ${evidence.record.hashes.bundleHash}
IPFS preview: ${evidence.record.hashes.ipfsCidPreview}
Chain preview: ${evidence.record.hashes.chainTxPreview}

${evidence.markdownReport}`;

  const legalSection = `## Legal Drafts

${legal.disclaimer}

${legal.draftDocuments.petition}`;

  const upgradeSection = `## Upgrade Concept

${upgrade.designName}

${upgrade.phases.map((phase) => `- ${phase.name}: ${phase.outputs.join(", ")}`).join("\n")}

Visualization prompt:
${upgrade.visualizationPrompt}

## Impact Comparison

${impact.comparisonTable.map((row) => `- ${row.metric}: upgrading ${row.upgrading}; demolition ${row.demolition}`).join("\n")}`;

  const advocacySection = `## Advocacy

${advocacy.petitionText}

## Coordination

${coordination.taskAssignments.map((task) => `- ${task.owner}: ${task.task} Due: ${task.due}.`).join("\n")}`;

  const header = `# Harmony Anchor Response Packet

Run ID: ${run.runId}
Community: ${run.community.name}
Generated: ${run.completedAt}`;

  return {
    full: `${header}\n\n${risk}\n\n${evidenceSection}\n\n${legalSection}\n\n${upgradeSection}\n\n${advocacySection}\n`,
    evidence: `${header}\n\n${evidenceSection}\n`,
    legal: `${header}\n\n${legalSection}\n`,
    upgrade: `${header}\n\n${upgradeSection}\n`,
    advocacy: `${header}\n\n${advocacySection}\n`
  };
}

function renderActivePacket() {
  if (!state.packetSections) return;
  els.packetOutput.textContent = state.packetSections[state.activePacket] || state.packetSections.full;
}

function selectPacket(packetId) {
  els.packetTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.packet === packetId));
  state.activePacket = packetId;
  renderActivePacket();
}

function saveOffline() {
  const packet = {
    savedAt: new Date().toISOString(),
    situation: els.situation.value,
    latestRun: state.latestRun
  };
  localStorage.setItem("harmony-offline-packet", JSON.stringify(packet));
  els.connectionStatus.textContent = "Saved offline";
}

function startNewIncident() {
  state.latestRun = null;
  state.packetSections = null;
  state.activePacket = "full";
  els.situation.value = "";
  els.packetTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.packet === "full"));
  els.packetOutput.textContent = "No packet generated yet.";
  els.riskScore.textContent = "--";
  els.riskLevel.textContent = "waiting";
  els.riskArc.style.strokeDashoffset = 427;
  els.timeline.textContent = "Run the swarm to generate a response.";
  els.confidence.textContent = "Confidence appears here after analysis.";
  els.residentCount.textContent = "--";
  els.artifactCount.textContent = "--";
  els.reviewStatus.textContent = "Draft";
  renderList(els.threatList, []);
  renderList(els.legalList, []);
  els.evidenceSummary.textContent = "Tamper-evident bundle will appear here.";
  els.upgradeSummary.textContent = "Concept plan will appear here.";
  els.impactTable.replaceChildren();
  renderList(els.taskList, []);
  els.evidenceCueList.innerHTML = "<span>Awaiting verified artifacts</span><span>Public summary locked</span>";
  els.responseTimeline.innerHTML = '<li data-phase="T+0">Generate a packet to build the first response plan.</li>';
  els.connectionStatus.textContent = "New incident ready";
  els.situation.focus();
}

function restoreOfflinePacket() {
  const cached = JSON.parse(localStorage.getItem("harmony-latest-run") || "null");
  if (cached) {
    state.latestRun = cached;
    renderRun(cached);
  }
}

async function copyPacket() {
  await navigator.clipboard.writeText(els.packetOutput.textContent);
  els.copyPacket.textContent = "Copied";
  setTimeout(() => {
    els.copyPacket.textContent = "Copy";
  }, 1200);
}

function openCounselMemo() {
  selectPacket("legal");
  els.packetOutput.scrollIntoView({ behavior: "smooth", block: "start" });
}

function captureVoiceNote() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    els.connectionStatus.textContent = "Voice unavailable";
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-NG";
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    els.situation.value = `${els.situation.value.trim()}\nVoice note: ${transcript}`.trim();
  };
  recognition.onerror = () => {
    els.connectionStatus.textContent = "Voice note failed";
  };
  recognition.start();
  els.connectionStatus.textContent = "Listening";
}

function setBusy(isBusy) {
  els.runSwarm.disabled = isBusy;
  els.runSwarm.textContent = isBusy ? "Working..." : "Generate response packet";
  document.body.dataset.busy = String(isBusy);
  if (isBusy) els.connectionStatus.textContent = "Working";
}

function updateConnection() {
  els.connectionStatus.textContent = navigator.onLine ? "Online + offline-ready" : "Offline-ready";
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`GET ${url} failed`);
  return response.json();
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`POST ${url} failed`);
  return response.json();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
