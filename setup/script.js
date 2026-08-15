import { initI18n, t, onLangChange } from "../shared/i18n.js";
import { deckUtility } from "../shared/combat.js";
import { MAPS, mapsForPlayers } from "./maps.js";

initI18n("setup");

const STEPS = ["welcome", "players", "map", "table", "deck", "rules"];
let currentStep = 0;
let playerCount = 0;
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
  document.querySelectorAll(".tile[data-n]").forEach((btn) => {
    btn.classList.toggle("selected", parseInt(btn.dataset.n, 10) === n);
  });
  const info = document.getElementById("player-info");
  info.innerHTML = t(`players.info.${n}`);
  info.classList.remove("hidden");
  document.getElementById("next-from-players").disabled = false;
  document.getElementById("next-from-map").disabled = true;
  renderMaps();
}

function renderMaps() {
  const list = document.getElementById("map-list");
  list.innerHTML = "";
  if (!playerCount) return;

  for (const map of mapsForPlayers(playerCount)) {
    list.appendChild(mapButton(map.id, t(`map.${map.id}`), `${map.buildings.length} · ${map.starts.join(" ")}`));
  }
  list.appendChild(mapButton("custom", t("map.custom"), t("map.custom.meta")));
  updateMapDetail();
}

function mapButton(id, title, meta) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "map-card";
  if (selectedMap === id) btn.classList.add("selected");
  btn.innerHTML = `${title}<span class="map-meta">${meta}</span>`;
  btn.addEventListener("click", () => selectMap(id));
  return btn;
}

function selectMap(id) {
  selectedMap = id;
  document.getElementById("next-from-map").disabled = false;
  renderMaps();
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
  selectedMap = null;
  deploy = 5;
  document.querySelectorAll(".tile[data-n]").forEach((btn) => btn.classList.remove("selected"));
  document.getElementById("player-info").classList.add("hidden");
  document.getElementById("player-info").innerHTML = "";
  document.getElementById("next-from-players").disabled = true;
  document.getElementById("next-from-map").disabled = true;
  document.getElementById("map-list").innerHTML = "";
  document.getElementById("map-detail").classList.add("hidden");
  document.querySelectorAll(".checklist li").forEach((li) => li.classList.remove("done"));
  updateChecklistProgress();
  nudgeDeploy(0);
  document.querySelectorAll(".rules-section").forEach((s) => s.classList.remove("open"));
  history.replaceState(null, "", location.pathname);
  showStep(0);
}

onLangChange(() => {
  if (playerCount) {
    document.getElementById("player-info").innerHTML = t(`players.info.${playerCount}`);
    renderMaps();
  }
});

if (location.hash === "#rules") showStep(STEPS.indexOf("rules"));

window.next = next;
window.prev = prev;
window.selectPlayers = selectPlayers;
window.toggleCheck = toggleCheck;
window.toggleRule = toggleRule;
window.resetWizard = resetWizard;
window.nudgeDeploy = nudgeDeploy;
