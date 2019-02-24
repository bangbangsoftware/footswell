import { bagItAndTagIt, put, switchPlugin, togglePlugin } from "binder";
import { banner } from "./banner";
import { timer } from "./time";
import { clear, tracker } from "./results";

let running = null;

const main = document.getElementById("results");
const events = tracker(document, main);

const secs = document.getElementById("seconds");
const mins = document.getElementById("minutes");
const clock = timer(mins, secs);

const resetBut = document.getElementById("reset");
resetBut.addEventListener("click", () => reset());

const playonBut = document.getElementById("playon");
playonBut.addEventListener("click", () => playOn());

const whistleBut = document.getElementById("whistle");
whistleBut.addEventListener("click", () => paused());

const finishedBut = document.getElementById("finished");
finishedBut.addEventListener("click", ev => ender(ev));

const kickoffBut = document.getElementById("kickoff");
kickoffBut.addEventListener("click", e => kickoff(e));

const concedeBut = document.getElementById("vrsScore");
concedeBut.addEventListener("click", e => concede(e));

const setupPlayers = () => {
  for (let n = 1; n < 22; n++) {
    const el = document.getElementById("position" + n);
    try {
      el.addEventListener("click", e => playerScored(e));
    } catch (ex) {
      console.error(n + ". failed is it in the markup?");
      console.error(ex);
    }
  }
};

banner();
bagItAndTagIt([switchPlugin, togglePlugin]);
setupPlayers();

const playerScored = e => {
  const who = e.target.innerText;
  if (!who) {
    console.log(
      e.target.name + " (" + e.target.id + ") has no player defined!"
    );
    return;
  }
  events.changeScore(1);
  events.post({ detail: "Goal by " + who, state: "scored" });
  const scored = document.getElementById("scored");
  scored.innerText = "!!! " + who + " scored !!!";
  scored.classList.remove("hide");
  put(scored);
  setTimeout(() => {
    document.getElementById("scored").classList.add("hide");
  }, 3000);
};

const kickoff = e => {
  e.target.style.display = "none";
  clear();
  document.getElementById("kickoff").classList.remove("hide");
  const where = document.getElementById("where").innerText;
  const op = document.getElementById("opposition").value;
  const detail = "Kick off at " + where.toLocaleLowerCase() + " vrs " + op;
  events.post({ detail });
  const scoreLabel = document.getElementById("score");
  scoreLabel.innerText = "0";
  const vrsScoreLabel = document.getElementById("vrsScore");
  vrsScoreLabel.innerText = "0";
  playOn();
};

const reset = () =>{
  events.post({ detail: "New quarter" });
  clock.reset();
};

const playOn = () => {
  running = setInterval(clock.increment, 1000);
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

const ender = ev => {
  paused();
  events.post({ detail: "Final Whistle" });
  events.download();
  const kickoffBut = document.getElementById("kickoff");
  kickoffBut.style.display = "block";
  ev.target.style.display = "none";
};

const concede = e => {
  const el = e.target;
  el.innerText = parseInt(el.innerText) + 1;
  const name = document.getElementById("opposition").value;
  events.post({
    detail: "Conceded a goal from " + name,
    state: "concide"
  });
};
