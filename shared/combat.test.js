import { toHitTN, deckUtility } from "./combat.js";
import assert from "node:assert/strict";

assert.equal(toHitTN({ target: "hh" }), 5);
assert.equal(toHitTN({ target: "su" }), 7);
assert.equal(toHitTN({ target: "hh", partialCover: true }), 6);
assert.equal(toHitTN({ target: "hh", alley: true }), 7);
assert.equal(toHitTN({ target: "hh", flank: true }), 4);
assert.equal(toHitTN({ target: "su", flank: true }), 7);
assert.equal(toHitTN({ target: "hh", fullCover: true }), null);
assert.equal(toHitTN({ target: "hh", partialCover: true, flank: true }), 5);

assert.equal(deckUtility(5), 7);
assert.equal(deckUtility(0), 12);
assert.throws(() => deckUtility(6));
assert.throws(() => deckUtility(1.5));

console.log("combat.test.js ok");
