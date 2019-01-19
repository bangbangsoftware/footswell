import { tableSetup, playerSetup } from "./setup.js";
import { setupScreen, setupField, setupFields } from "./gears.js";

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
const stored = window.localStorage.getItem("players");
const players = stored ? JSON.parse(stored) : standard;

setupScreen("setup");
setupScreen("play");
setupScreen("team");
setupScreen("fix");
setupFields("players", players.map(p => p.name));
setupField("teamName");

const bench = players.filter(player => player.place === "bench");
const pitch = players.filter(player => player.place === "pitch");
const noshow = players.filter(player => player.place === "noshow");
tableSetup("bench", players, bench);
tableSetup("noshow", players, noshow);
playerSetup("pitch", pitch);
