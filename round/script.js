import { initI18n, t, onLangChange } from "../shared/i18n.js";
import { toHitTN } from "../shared/combat.js";

initI18n("round");

const STORAGE_KEY = "gkr-round";
const PHASES = [
  "deploy",
  "move-hh",
  "move-combat",
  "move-repair",
  "move-recon",
  "combat",
  "tag",
  "reset",
];

const state = load() ?? {
  round: 1,
  phase: 0,
  target: "hh",
  partialCover: false,
  alley: false,
  flank: false,
  fullCover: false,
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  document.getElementById("round-label").textContent = t("round.label", { n: state.round });
  document.getElementById("phase-name").textContent = t(`phase.${PHASES[state.phase]}.name`);
  document.getElementById("phase-hint").textContent = t(`phase.${PHASES[state.phase]}.hint`);
  document.getElementById("prev-phase").disabled = state.round === 1 && state.phase === 0;
  document.getElementById("to-hit").classList.toggle("hidden", PHASES[state.phase] !== "combat");

  const pills = document.getElementById("phase-pills");
  pills.innerHTML = "";
  PHASES.forEach((id, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "phase-pill";
    if (i < state.phase) btn.classList.add("done");
    if (i === state.phase) btn.classList.add("current");
    btn.textContent = t(`pill.${id}`);
    btn.addEventListener("click", () => {
      state.phase = i;
      save();
      render();
    });
    pills.appendChild(btn);
  });

  document.querySelectorAll("[data-target]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.target === state.target));
  });
  document.querySelectorAll("[data-mod]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(Boolean(state[btn.dataset.mod])));
  });

  const tn = toHitTN(state);
  const out = document.getElementById("hit-result");
  if (tn == null) {
    out.textContent = t("hit.blocked");
    out.classList.add("blocked");
  } else {
    out.textContent = t("hit.result", { n: tn });
    out.classList.remove("blocked");
  }
}

function nextPhase() {
  if (state.phase === PHASES.length - 1) {
    state.phase = 0;
    state.round += 1;
  } else {
    state.phase += 1;
  }
  save();
  render();
}

function prevPhase() {
  if (state.phase === 0) {
    if (state.round === 1) return;
    state.phase = PHASES.length - 1;
    state.round -= 1;
  } else {
    state.phase -= 1;
  }
  save();
  render();
}

function resetMatch() {
  state.round = 1;
  state.phase = 0;
  state.target = "hh";
  state.partialCover = false;
  state.alley = false;
  state.flank = false;
  state.fullCover = false;
  save();
  render();
}

document.getElementById("next-phase").addEventListener("click", nextPhase);
document.getElementById("prev-phase").addEventListener("click", prevPhase);
document.getElementById("reset-match").addEventListener("click", resetMatch);

document.getElementById("to-hit").addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;
  if (btn.dataset.target) state.target = btn.dataset.target;
  if (btn.dataset.mod) state[btn.dataset.mod] = !state[btn.dataset.mod];
  save();
  render();
});

onLangChange(render);
render();
