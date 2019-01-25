import { setupScreen, tableSetup, playerSetup } from "./gears.js";

export function setupSetup(players) {
  setupScreen("setup");
  const bench = players.filter(player => player.place === "bench");
  const pitch = players.filter(player => player.place === "pitch");
  const noshow = players.filter(player => player.place === "noshow");
  tableSetup("bench", players, bench);
  tableSetup("noshow", players, noshow);
  playerSetup("setup-pitch", pitch);
}
