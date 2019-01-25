import { set } from "./persist.js";
import { setupScreen, playerSetup } from "./gears.js";

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
    console.log(
      date + "%c" + player + " scored!!",
      "font-size:300%; color:red"
    );
    const goal = document.getElementById("goal");
    const timer = document.getElementById("timer");
    timer.classList.add("hide");
    goal.innerText = "!!! " + player + " scored !!!";
    goal.classList.remove("hide");
    goal.classList.add("goal");
    setTimeout(() => {
      goal.classList.remove("goal");
      goal.classList.add("hide");
      timer.classList.remove("hide");
    }, 5000);
    const goals = document.getElementById("scored");
    const score = parseInt(goals.innerText) + 1;
    goals.innerText = score;
    const result = { date, player, score };
    set("score", result);
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
    timeButton.innerText = "Start";
    clearInterval(running);
    running = false;
    return;
  }
  timeButton.innerText = "Stop";
  running = setInterval(increment, 1000);
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

  seconds.innerText = secs < 10 ? "0" + secs : secs;
};

const goalTaken = (teamName, scoreID) => {
  const name = teamName.innerText;
  const date = new Date();
  console.log(
    date + "%c " + name + " taken goal away",
    "font-size:100%; color:gray"
  );
  const scoreValue = document.getElementById(scoreID);
  const adjustedScore = parseInt(scoreValue.innerText) - 1;
  const score = adjustedScore < 0 ? 0 : adjustedScore;
  scoreValue.innerText = score;
  const goal = { date, name, score };
  set("score", goal);
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
    console.log(date + "%c" + name + " scored", "font-size:100%; color:gray");
    const against = document.getElementById("vrsScored");
    const score = parseInt(against.innerText) + 1;
    against.innerText = score;
    const goal = { date, player, score };
    set("score", goal);
  });
};
