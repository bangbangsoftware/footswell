import { tableSetup, playerSetup, updateButton } from "./setup.js";
import { setupScreen, setupTeamName, setupFields } from "./gears.js";
import { get, sub } from "./persist.js";

const standard = [
  { name: "Player 1", place: "pitch" },
  { name: "Player 2", place: "pitch" },
  { name: "Player 3", place: "pitch" },
  { name: "Player 4", place: "pitch" },
  { name: "Player 5", place: "pitch" },
  { name: "Player 6", place: "pitch" },
  { name: "Player 7", place: "bench" },
  { name: "Player 8", place: "bench" }
];
const storedPlayers = get("players");
const players = storedPlayers ? storedPlayers : standard;

setupScreen("setup");
setupScreen("play");
setupScreen("team");
setupScreen("fix");
setupScreen("admin");
setupFields("players", players.map(p => p.name));
setupTeamName();
setupTeamName("vrsName");

const populate = players => {
  const bench = players.filter(player => player.place === "bench");
  const pitch = players.filter(player => player.place === "pitch");
  const noshow = players.filter(player => player.place === "noshow");
  tableSetup("bench", players, bench);
  tableSetup("noshow", players, noshow);
  playerSetup("setup-pitch", pitch);
  playerSetup("play-pitch", pitch);
};

populate(players);
sub("players", update => updateButton(update));
