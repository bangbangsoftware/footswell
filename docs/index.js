import { tableSetup, playerSetup, updateButton } from "./setup.js";
import { setupScreen, setupTeamName, setupFields } from "./gears.js";
import { get, sub, set } from "./persist.js";

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
  const goals = document.getElementById("scored");
  const against = document.getElementById("vrsScored");
  const againstName = document.getElementById("vrsNameDisplay2");
  againstName.addEventListener("click",()=>{
    const player = otherScore.innerText;
    const date = new Date();
    console.log(date + "%c" + name + " scored", "font-size:100%; color:gray");
    const score = parseInt(against.innerText) - 1;
    against.innerText = score;
    const goal = { date, player, score };
    set("score", goal);
 
  })
  const ourName = document.getElementById("teamNameDisplay2");
  playerSetup("play-pitch", pitch, but => {
    const player = but.innerText;
    const date = new Date();
    console.log(
      date + "%c" + player + " scored!!",
      "font-size:300%; color:red"
    );
    const score = parseInt(goals.innerText) + 1;
    goals.innerText = score;
    const goal = { date, player, score };
    set("score", goal);
  });
  const otherScore = document.getElementById("vrsNameDisplay");
  otherScore.addEventListener("click", () => {
    const player = otherScore.innerText;
    const date = new Date();
    console.log(date + "%c" + name + " scored", "font-size:100%; color:gray");
    const score = parseInt(against.innerText) + 1;
    against.innerText = score;
    const goal = { date, player, score };
    set("score", goal);
  });
};

populate(players);
sub("players", update => updateButton(update));
