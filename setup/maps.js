/** Pre-generated maps from the official rulebook (pp. 35–38). */
export const MAPS = [
  {
    id: "final-stand",
    players: 2,
    buildings: ["3C", "3E", "4H", "4I", "5C", "6D", "6G", "6I"],
    starts: ["1F", "9F"],
  },
  {
    id: "plateau",
    players: 2,
    buildings: ["3C", "3D", "4G", "4J", "5E", "6B", "6I", "7H"],
    starts: ["1F", "9F"],
  },
  {
    id: "three-walls",
    players: 3,
    buildings: ["2G", "3D", "3F", "4I", "5C", "6D", "6H", "7E", "7H"],
    starts: ["1D", "5K", "8C"],
  },
  {
    id: "citadel",
    players: 3,
    buildings: ["2G", "3H", "4C", "4F", "5C", "5E", "5G", "7G", "7H"],
    starts: ["1D", "5K", "8C"],
  },
  {
    id: "showdown",
    players: 4,
    buildings: ["2G", "3D", "4F", "4I", "5B", "5C", "5J", "6F", "7E", "7H"],
    starts: ["1B", "1J", "9B", "9J"],
  },
  {
    id: "crackshot",
    players: 4,
    buildings: ["2G", "3E", "3H", "4B", "4E", "5G", "6G", "6J", "7D", "7E"],
    starts: ["1B", "1J", "9B", "9J"],
  },
  {
    id: "salvage",
    players: 4,
    buildings: ["2D", "2H", "3G", "4B", "4E", "5G", "6E", "6J", "7D", "7H"],
    starts: ["1B", "1J", "9B", "9J"],
  },
];

export function mapsForPlayers(n) {
  return MAPS.filter((m) => m.players === n);
}
