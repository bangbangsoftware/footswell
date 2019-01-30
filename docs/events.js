import { put, set } from "./persist.js";

export function goal(name) {
  const formation = getForm();
  const date = new Date();
  const goal = { date, name };
  set("score", { goal, formation, score: whatTheScore() });
}

const whatTheScore = () => {
  const otherName = document.getElementById("vrsNameDisplay2").innerText;
  const teamName = document.getElementById("teamNameDisplay2").innerText;
  const scored = document.getElementById("scored").innerText;
  const otherScored = document.getElementById("vrsScored").innerText;
  const scores = [];
  scores.push({ team: teamName, scored });
  scores.push({ team: otherName, scored: otherScored });
  return scores;
};

export function kickoff() {
  const when = new Date();
  const formation = getForm();
  put("kickoff", { when, formation });
}

export function paused() {
  const when = new Date();
  const formation = getForm();
  set("paused", { when, formation });
}

export function restart() {
  const when = new Date();
  const formation = getForm();
  set("restarted", { when, formation });
}

const getForm = () => {
  return {
    fl: document.getElementById("play-pitch--fl").innerText,
    fr: document.getElementById("play-pitch--fr").innerText,
    bl: document.getElementById("play-pitch--bl").innerText,
    bc: document.getElementById("play-pitch--bc").innerText,
    br: document.getElementById("play-pitch--br").innerText,
    goal: document.getElementById("play-pitch--g").innerText
  };
};

export function penality() {}
