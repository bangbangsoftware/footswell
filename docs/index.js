import { setupTeamName } from "./gears.js";
import { setupSetup } from "./setup.js";
import { setupTeam } from "./team.js";
import { setupFix } from "./fix.js";
import { setupAdmin } from "./admin.js";
import { get } from "./persist.js";
import { setupPlay } from "./play.js";

const standard = [
  { name: "Player 1", place: "pitch" },
  { name: "Player 2", place: "pitch" },
  { name: "Player 3", place: "pitch" },
  { name: "Player 4", place: "pitch" },
  { name: "Player 5", place: "pitch" },
  { name: "Player 6", place: "pitch" },
  { name: "Player 7", place: "bench" },
  { name: "Player 8", place: "bench" },
  { name: "Player 9", place: "bench" },
];
const storedPlayers = get("players");
const players = storedPlayers || standard;
const pitch = players.filter(player => player.place === "pitch");

setupAdmin();
setupSetup(players);
setupPlay(pitch);
setupTeam(players);
setupFix();

setupTeamName();
setupTeamName("vrsName");
