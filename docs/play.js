import { setupScreen, playerSetup } from "./gears.js";
import { kickoff, paused, restart, goal, final, badGoal } from "./events.js";

export function setupPlay(pitch) {
  setupScreen("play");
  setupTimer();
  playPitchSetup(pitch);
  setupAction();
}

const playPitchSetup = pitch => {
  playerSetup("play-pitch", pitch, but => {
    const player = but.innerText;
    const date = new Date();
    console.log(`${date}%c${player} scored!!`, "font-size:300%; color:red");
    const goalElement = document.getElementById("goal");
    const timer = document.getElementById("timer");
    timer.classList.add("hide");
    goalElement.innerText = `!!! ${player} scored !!!`;
    goalElement.classList.remove("hide");
    goalElement.classList.add("goal");
    setTimeout(() => {
      goalElement.classList.remove("goal");
      goalElement.classList.add("hide");
      timer.classList.remove("hide");
    }, 5000);
    const goals = document.getElementById("scored");
    const score = parseInt(goals.innerText) + 1;
    goals.innerText = score;
    goal(player);
  });
};

const setupTimer = () => {
  const timer = document.getElementById("timer");
  timer.addEventListener("click", () => {
    const seconds = document.getElementById("seconds");
    const minutes = document.getElementById("minutes");
    seconds.innerText = "00";
    minutes.innerText = "00";
  });
  const timeButton = document.getElementById("startBut");
  timeButton.addEventListener("click", () => start());
};

let running = false;
const start = () => {
  const timeButton = document.getElementById("startBut");
  if (running) {
    timeButton.innerText = "START";
    clearInterval(running);
    running = false;
    paused();
    return;
  }
  if (timeButton.innerText === "KICK OFF") {
    kickoff();
    const div = document.getElementById("bot-but");
    const fin = document.createElement("button");
    fin.innerText = "Final Whistle";
    fin.addEventListener("click", () => final());
    div.appendChild(fin);
  }
  timeButton.innerText = "PAUSE";
  running = setInterval(increment, 1000);
  restart();
};

const increment = () => {
  const seconds = document.getElementById("seconds");
  const minutes = document.getElementById("minutes");
  const secs = parseInt(seconds.innerText) + 1;
  if (secs > 59) {
    seconds.innerText = 0;
    const mins = parseInt(minutes.innerText) + 1;
    minutes.innerText = mins;
    return;
  }
  seconds.innerText = secs < 10 ? `0${secs}` : secs;
};

const goalTaken = (teamName, scoreID) => {
  const name = teamName.innerText;
  const date = new Date();
  console.log(
    `${date}%c ${name} taken goal away`,
    "font-size:100%; color:gray"
  );
  const scoreValue = document.getElementById(scoreID);
  const adjustedScore = parseInt(scoreValue.innerText) - 1;
  const score = adjustedScore < 0 ? 0 : adjustedScore;
  scoreValue.innerText = score;
  badGoal(name);
};

const setupAction = () => {
  const otherName = document.getElementById("vrsNameDisplay2");
  const teamName = document.getElementById("teamNameDisplay2");
  otherName.addEventListener("click", () => goalTaken(otherName, "vrsScored"));
  teamName.addEventListener("click", () => goalTaken(teamName, "scored"));
  const otherScore = document.getElementById("vrsNameDisplay");
  otherScore.addEventListener("click", () => {
    const player = otherScore.innerText;
    const date = new Date();
    console.log(`${date}%c${name} scored`, "font-size:100%; color:gray");
    const against = document.getElementById("vrsScored");
    const score = parseInt(against.innerText) + 1;
    against.innerText = score;
    goal(player);
  });
};
