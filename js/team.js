import { setupScreen, setupFields, updateButton } from "./gears.js";
import { sub } from "./persist.js";

export function setupTeam(players) {
  setupScreen("team");
  setupFields("players", players.map(p => p.name));
  sub("players", update => updateButton(update));
}
