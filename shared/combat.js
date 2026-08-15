/** Target number to hit. `null` = no legal direct-fire shot (full cover). */
export function toHitTN({ target, partialCover, alley, flank, fullCover }) {
  if (fullCover) return null;
  let tn = target === "su" ? 7 : 5;
  if (partialCover) tn += 1;
  if (alley) tn += 2;
  if (flank && target === "hh") tn -= 1;
  return tn;
}

/** Remaining orbital / maneuver / reaction cards after weapons + deploy. */
export function deckUtility(deploy) {
  const n = Number(deploy);
  if (!Number.isInteger(n) || n < 0 || n > 5) throw new Error("deploy must be 0–5");
  return 12 - n;
}
