import { bagItAndTagIt, put, switchPlugin, togglePlugin } from "binder";
import { banner } from "./banner";
import { increment, timeFormat, reset } from "./time";
import { changeScore, results, download } from "./results";

banner();
bagItAndTagIt([switchPlugin, togglePlugin]);

let running = null;

for (let n = 1; n < 22; n++) {
  const el = document.getElementById("position" + n);
  try {
    el.addEventListener("click", e => playerScored(e));
  } catch (ex) {
    console.error(n + ". failed is it in the markup?");
    console.error(ex);
  }
}

const playerScored = e => {
  console.log(e.target.innerText + " scored!");
  const who = e.target.innerText;
  if (!who) {
    console.log(
      e.target.name + " (" + e.target.id + ") has no player defined!"
    );
    return;
  }
  changeScore(1);
  const time = timeFormat();
  results({ time, detail: "Goal by " + who, state: "scored" });
  const scored = document.getElementById("scored");
  scored.innerText = "!!! " + who + " scored !!!";
  scored.classList.remove("hide");
  put(scored);
  setTimeout(() => {
    document.getElementById("scored").classList.add("hide");
  }, 3000);
};

const kickoff = document.getElementById("kickoff");
kickoff.addEventListener("click", e => {
  e.target.style.display = "none";
  document.getElementById("kickoff").classList.remove("hide");
  const time = timeFormat();
  const where = document.getElementById("where").innerText;
  const op = document.getElementById("opposition").value;
  results({ time, detail: "Kick off " + where + " vrs " + op });
  const scoreLabel = document.getElementById("score");
  scoreLabel.innerText = "0";
  const vrsScoreLabel = document.getElementById("vrsScore");
  vrsScoreLabel.innerText = "0";
  playOn();
});

const playOn = () => {
  running = setInterval(increment, 1000);
  document.getElementById("whistle").classList.remove("hide");
  document.getElementById("playing").classList.remove("hide");
  document.getElementById("bench").classList.add("hide");
  document.getElementById("stateblock").style.display = "none";
};
const paused = () => {
  document.getElementById("whistle").classList.add("hide");
  document.getElementById("playing").classList.add("hide");
  document.getElementById("bench").classList.remove("hide");
  document.getElementById("stateblock").style.display = "grid";
  clearInterval(running);
  running = null;
};

const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => reset());

const playonButton = document.getElementById("playon");
playonButton.addEventListener("click", () => playOn());

const whistle = document.getElementById("whistle");
whistle.addEventListener("click", () => paused());

const finished = document.getElementById("finished");
finished.addEventListener("click", () => {
  clearInterval(running);
  running = null;
  const time = timeFormat();
  results({ time, detail: "Final Whistle" });
  download();
});

const concede = document.getElementById("vrsScore");
concede.addEventListener("click", e => {
  const el = e.target;
  el.innerText = parseInt(el.innerText) + 1;
  const time = timeFormat();
  const name = document.getElementById("opposition").value;
  results({ time, detail: "Conceded a goal from " + name, state: "concide" });
});