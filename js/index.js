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
kickoffBut.addEventListener("click", () => kickoff());

const concedeBut = document.getElementById("vrsScore");
concedeBut.addEventListener("click", () => concede());

const formBut1 = document.getElementById("newForm1");
formBut1.addEventListener("click", () => postForm());

const formBut2 = document.getElementById("newForm2");
formBut2.addEventListener("click", () => postForm());

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
  events.post({ detail: "Goal by " + who, state: "scored" });
  const scored = document.getElementById("scored");
  scored.innerText = "!!! " + who + " scored !!!";
  scored.classList.remove("hide");
  put(scored);
  setTimeout(() => {
    document.getElementById("scored").classList.add("hide");
  }, 3000);
};

const getFormations = (from, to) => {
  let output = "";
  for (let n = from; n < to; n++) {
    const el = document.getElementById("position" + n);
    if (el.innerText) {
      output = output === "" ? el.innerText : output + ", " + el.innerText;
    }
  }
  return output;
};

const kickoff = () => {
  document.getElementById("kickoff-grid").style.display = "none";
  document.getElementById("finished").classList.remove("hide");
  clear();
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

const reset = () => {
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

const concede = () => {
  const name = document.getElementById("opposition").value;
  events.post({
    detail: "Conceded a goal from " + name,
    state: "concide"
  });
};

const adder = (tag, from, to) =>{
  const positions = getFormations(from, to);
  if (!positions){
    return "";
  }
  return tag+": "+positions+". ";
};

const postForm = () => {
  console.log("FORMATION");
  const front = adder("Up front",1, 6);
  const mid = adder("Midfield",6, 11);
  const back = adder("Back",11, 16);
  const goal = adder("Goal",16, 17);
  const detail = "Formation-  "+front+mid+back+goal;
  events.post({detail});
};
