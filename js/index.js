import { bagItAndTagIt, put, get, setMode, getMode } from "binder";
import { swapperPlugin } from "binder/dist/plugins/swapperPlugin";
import { togglePlugin } from "binder/dist/plugins/togglePlugin";
import { showHidePlugin } from "binder/dist/plugins/showhidePlugin";
import { ifPlugin } from "binder/dist/plugins/ifPlugin";
import { banner } from "./banner";
import { timer } from "./time";
import { clear, tracker } from "./results";

import { swapPlugin, actionMover } from "binder/dist/plugins/swapPlugin.js";

const group = "swaps";
const actionID = "captain-butt";
const data = "- Captian -";
const dataIDpostFix = "data";
const mover = { group, actionID, data, dataIDpostFix };
actionMover(mover);

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

const concedeBut2 = document.getElementById("vrsNameButton");
concedeBut2.addEventListener("click", () => concede());

const infoBut1 = document.getElementById("updateInfo");
infoBut1.addEventListener("click", () => postForm());

const infoBut2 = document.getElementById("updateInfo2");
infoBut2.addEventListener("click", () => postForm());

const where = document.getElementById("where");
where.addEventListener("click", () => toggleWhere());

const edit = document.getElementById("edit");
edit.addEventListener("click", () => toggleEdit());

const setupPlayers = () => {
  for (let n = 1; n < 22; n++) {
    const el = document.getElementById("slot" + n + "b");
    try {
      el.addEventListener("click", e => playerScored(e));
    } catch (ex) {
      console.error(n + ". failed is it in the markup?");
      console.error(ex);
    }
  }
};

banner();
bagItAndTagIt([
  swapPlugin,
  swapperPlugin,
  togglePlugin,
  showHidePlugin,
  ifPlugin
]);
setupPlayers();

const playerScored = e => {
  if (getMode() !== "kickoff") {
    return;
  }
  const element = e.target;
  const who = getPlayerName(element);
  if (!who) {
    console.error(
      element.name + " (" + element.id + ") has no player defined!"
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

const kickoff = () => {
  setMode("kickoff");
  document.getElementById("where").style.display = "none";
  document.getElementById("kickoff-grid").style.display = "none";
  document.getElementById("finished").classList.remove("hide");
  document.getElementById("vrsNameButton").classList.remove("hide");
  document.getElementById("score").classList.remove("hide");
  document.getElementById("vrsScore").classList.remove("hide");
  document.getElementById("time").classList.remove("hide");
  document.getElementById("opposition").style.display = "none";
  clear();
  const detail = createKickOffText();
  events.post({ detail });
  const scoreLabel = document.getElementById("score");
  scoreLabel.innerText = "0";
  const vrsScoreLabel = document.getElementById("vrsScore");
  vrsScoreLabel.innerText = "0";
  playOn();
};

const createKickOffText = (toggle = false) => {
  const where = document.getElementById("where").innerText;
  const toggleText = where === "HOME" ? "away" : "home";
  const whereText = toggle ? toggleText : where.toLowerCase();
  const op = document.getElementById("opposition").value;
  return "Kick off " + whereText + " vrs " + op;
};

const toggleEdit = () => {
  const current = getMode();
  const nextMode = current == "edit" ? "" : "edit";
  setMode(nextMode);
};


const toggleWhere = () => {
  const last = createKickOffText();
  const updated = createKickOffText(true);
  events.replacePost(last, updated);
};

let lastUpdate;
const reset = () => {
  events.post({ detail: "Second Half" });
  clock.reset();
  lastUpdate = new Date();
};

const playOn = () => {
  setMode("kickoff");
  lastUpdate = new Date();
  running = setInterval(() => {
    lastUpdate = clock.adjust(lastUpdate);
  }, 1000);
  document.getElementById("whistle").classList.remove("hide");
  document.getElementById("stateblock").style.display = "none";
};

const paused = () => {
  setMode("");
  document.getElementById("whistle").classList.add("hide");
  document.getElementById("stateblock").style.display = "grid";
  clearInterval(running);
  running = null;
};

const ender = ev => {
  paused();
  const vrsScore = document.getElementById("vrsScore").innerText;
  const score = document.getElementById("score").innerText;
  const vrsName = document.getElementById("opposition").value;
  const name = document.getElementById("teamName").value;
  events.post({
    detail:
      "Final Whistle- " +
      name +
      ":" +
      score +
      " vrs " +
      vrsName +
      ": " +
      vrsScore +
      ""
  });
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

const getInnerNames = id => {
  const el = document.getElementById(id);
  if (el == null) {
    console.error(id + " doesn't exist?!");
    return null;
  }
  return getNames(el);
};

const getNames = (el, list = []) => {
  const name = el.getAttribute("name");
  if (name != null) {
    list.push(name);
  }
  if (el.children.length > 0) {
    for (let i = 0; i < el.children.length; i++) {
      list = getNames(el.children[i], list);
    }
  }
  return list;
};

const isCaptain = names => {
  const key = names.find(name => name.indexOf(dataIDpostFix) > -1);
  if (key == null) {
    return false;
  }
  try {
    const captain = get(key);
    return captain.currentValue.length > 0;
  } catch (error) {
    console.error(error);
  }
  return false;
};

const getPlayerName = element => {
  const names = getNames(element);
  return getPlayerNameFromList(names);
};

const getPlayerNameFromList = names => {
  const key = names.find(name => name.indexOf(dataIDpostFix) == -1);
  if (key == null) {
    return null;
  }
  const playerName = get(key);
  return playerName.currentValue;
};

const getFormation = (prefix, n = 1, output = "") => {
  if (n > 5) {
    return output;
  }
  const id = prefix + "-" + n;
  const names = getInnerNames(id);
  const playerName = getPlayerNameFromList(names);
  const isCap = isCaptain(names);
  const cap = isCap ? "(Captain)" : "";
  if (playerName == null) {
    console.error(id + " has no player name ?!!");
  } else {
    const player = playerName + cap;
    output = output === "" ? player : output + ", " + player;
  }
  return getFormation(prefix, n + 1, output);
};

const adder = (tag, prefix) => {
  const positions = getFormation(prefix, 1, "");
  if (!positions) {
    return "";
  }
  return tag + ": " + positions + ". ";
};

const getGoalie = () => {
  const names = getInnerNames("goalie");
  const playerName = getPlayerNameFromList(names);
  return "Goalie: " + playerName;
};

const postForm = () => {
  const front = adder("Up front", "front");
  const mid = adder("Mid field", "mid");
  const back = adder("Back", "back");
  const goal = getGoalie();
  const detail = "Formation-  " + front + mid + back + goal;
  console.log("FORMATION ", detail);
  events.post({ detail });
};
