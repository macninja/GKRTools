# GKRTools

Table-side helpers for **GKR: Heavy Hitters**. Open any tool in a browser – no build step required.

## Quick start

Open [`index.html`](index.html), or jump straight to a tool:

- [Setup Wizard](setup/index.html) – battlefield maps, physical setup, 25-card deck, rules reference
- [Round Tracker](round/index.html) – phase order, movement steps, to-hit helper

Danish is the default language; use the 🇩🇰 / 🇬🇧 switcher in the top-right corner.

## Setup Wizard

Quick-start wizard to get from box to first round without flipping through the rulebook.

1. **Player count** – 2–4, with map and 2v2 notes
2. **Battlefield** – official maps with building and starting hexes (rulebook pp. 35–38)
3. **Table checklist** – Glory Hound, factions, pilots, achievements, sponsors
4. **Deck builder** – 1 primary + 2 secondaries + deploy (0–5) + remaining utility = 25
5. **Rules reference** – collapsible sections for energy, combat, cover, tagging, and gotchas

Rules content is checked against the official rulebook. Checklist state resets on "Start forfra". Deep-link: `setup/index.html#rules`.

## Round Tracker

Phone helper for the current phase. State persists in `localStorage` (survives refresh).

- **Phase order** – Deploy → HH → Combat → Repair → Recon → Combat → Tag → Reset
- **To-hit** – base 5+/7+ with partial cover, alley, flank, and full cover
- Tapping a phase pill jumps there; Reset → Deploy increments the round

## Development

```bash
npm test          # combat math + map data checks
npx serve .       # serve repo root locally
```

## Project layout

```
GKRTools/
├── index.html          – hub page
├── shared/gkr.css      – shared theme + all tool styles
├── setup/              – setup wizard (maps, deck, rules)
└── round/              – phase tracker + to-hit
```

## GitHub Pages

Deploy the repo root as a static site. The hub links to both tools under their subfolders.

## License

Fan tools, not affiliated with Weta Workshop / Cryptozoic.
