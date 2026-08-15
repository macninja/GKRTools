import { MAPS, mapsForPlayers } from "./maps.js";
import assert from "node:assert/strict";

assert.equal(MAPS.length, 7);
assert.equal(mapsForPlayers(2).length, 2);
assert.equal(mapsForPlayers(3).length, 2);
assert.equal(mapsForPlayers(4).length, 3);

for (const map of MAPS) {
  assert.equal(map.starts.length, map.players);
  assert.ok(map.buildings.length >= 8);
  assert.equal(new Set(map.buildings).size, map.buildings.length);
}

console.log("maps.test.js ok");
