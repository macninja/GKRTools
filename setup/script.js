import { initI18n, t, onLangChange } from "../shared/i18n.js";
import { deckUtility } from "../shared/combat.js";
import { MAPS, mapsForPlayers } from "./maps.js";

initI18n("setup");

const STEPS = ["welcome", "tree", "table", "deck", "rules"];
let currentStep = 0;
let playerCount = 0;
let playMode = "ffa";
let selectedMap = null;
let deploy = 5;

function showStep(idx) {
  currentStep = idx;
  document.querySelectorAll(".step").forEach((el, i) => {
    el.classList.toggle("active", i === idx);
  });
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress() {
  document.querySelectorAll(".progress-bar .dot").forEach((dot, i) => {
    dot.classList.remove("done", "current");
    if (i < currentStep) dot.classList.add("done");
    if (i === currentStep) dot.classList.add("current");
  });
}

function next() {
  if (currentStep < STEPS.length - 1) showStep(currentStep + 1);
}

function prev() {
  if (currentStep > 0) showStep(currentStep - 1);
}

function selectPlayers(n) {
  playerCount = n;
  selectedMap = null;
  playMode = "ffa";
  document.querySelectorAll("#tree-players .tree-node").forEach((btn) => {
    btn.classList.toggle("selected", parseInt(btn.dataset.n, 10) === n);
  });
  document.getElementById("next-from-tree").disabled = true;
  renderTree();
}

function selectMode(mode) {
  playMode = mode;
  renderTree();
}

function selectMap(id) {
  selectedMap = id;
  document.getElementById("next-from-tree").disabled = false;
  renderTree();
}

function renderTree() {
  const modeWrap = document.getElementById("tree-mode-wrap");
  const mapsWrap = document.getElementById("tree-maps-wrap");
  const info = document.getElementById("player-info");

  if (!playerCount) {
    modeWrap.classList.add("hidden");
    mapsWrap.classList.add("hidden");
    info.classList.add("hidden");
    updateMapDetail();
    return;
  }

  modeWrap.classList.toggle("hidden", playerCount !== 4);
  document.querySelectorAll("#tree-mode .tree-node").forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.mode === playMode);
  });

  mapsWrap.classList.remove("hidden");
  const list = document.getElementById("tree-maps");
  list.innerHTML = "";
  for (const map of mapsForPlayers(playerCount)) {
    list.appendChild(mapButton(map.id, t(`map.${map.id}`), `${map.buildings.length} · ${map.starts.join(" ")}`));
  }
  list.appendChild(mapButton("custom", t("map.custom"), t("map.custom.meta")));

  const infoKey = playerCount === 4 && playMode === "tvt" ? "tree.info.4tvt" : `players.info.${playerCount}`;
  info.innerHTML = t(infoKey);
  info.classList.remove("hidden");
  updateMapDetail();
}

function mapButton(id, title, meta) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tree-node tree-leaf";
  if (selectedMap === id) btn.classList.add("selected");
  btn.innerHTML = `${title}<span class="map-meta">${meta}</span>`;
  btn.addEventListener("click", () => selectMap(id));
  return btn;
}

function updateMapDetail() {
  const detail = document.getElementById("map-detail");
  const map = MAPS.find((m) => m.id === selectedMap);
  if (!map) {
    detail.classList.add("hidden");
    return;
  }
  detail.classList.remove("hidden");
  fillChips("map-buildings", map.buildings, "");
  fillChips("map-starts", map.starts, "start");
}

function fillChips(id, coords, extraClass) {
  const row = document.getElementById(id);
  row.innerHTML = "";
  for (const coord of coords) {
    const chip = document.createElement("span");
    chip.className = extraClass ? `chip ${extraClass}` : "chip";
    chip.textContent = coord;
    row.appendChild(chip);
  }
}

function toggleCheck(el) {
  el.classList.toggle("done");
  updateChecklistProgress();
}

function updateChecklistProgress() {
  const items = document.querySelectorAll("#table-checklist li");
  const done = document.querySelectorAll("#table-checklist li.done");
  document.getElementById("table-counter").textContent = `${done.length} / ${items.length}`;
}

function toggleRule(el) {
  el.parentElement.classList.toggle("open");
}

function nudgeDeploy(delta) {
  deploy = Math.min(5, Math.max(0, deploy + delta));
  document.getElementById("deploy-count").textContent = String(deploy);
  document.getElementById("utility-count").textContent = String(deckUtility(deploy));
}

function resetWizard() {
  playerCount = 0;
  playMode = "ffa";
  selectedMap = null;
  deploy = 5;
  document.querySelectorAll("#tree-players .tree-node").forEach((btn) => btn.classList.remove("selected"));
  document.getElementById("player-info").classList.add("hidden");
  document.getElementById("player-info").innerHTML = "";
  document.getElementById("next-from-tree").disabled = true;
  document.getElementById("tree-maps").innerHTML = "";
  document.getElementById("tree-mode-wrap").classList.add("hidden");
  document.getElementById("tree-maps-wrap").classList.add("hidden");
  document.getElementById("map-detail").classList.add("hidden");
  document.querySelectorAll(".checklist li").forEach((li) => li.classList.remove("done"));
  updateChecklistProgress();
  nudgeDeploy(0);
  document.querySelectorAll(".rules-section").forEach((s) => s.classList.remove("open"));
  history.replaceState(null, "", location.pathname);
  showStep(0);
}

onLangChange(renderTree);

if (location.hash === "#rules") showStep(STEPS.indexOf("rules"));

window.next = next;
window.prev = prev;
window.selectPlayers = selectPlayers;
window.selectMode = selectMode;
window.toggleCheck = toggleCheck;
window.toggleRule = toggleRule;
window.resetWizard = resetWizard;
window.nudgeDeploy = nudgeDeploy;
