import { put, set, get, del } from "./persist.js";

// Perhaps there should just be one local store -> game...
//
// As the results should look like...
//
// Southwell City Under 8’s Home game: *Minecraft* vrs *Calverton* on *Sat 2 Feb 2019*,,,,,,,
// ,,,,,,,
// Time ,Event,Front Left,Front Right,Left Back,Left Center Back,Right Back,Goal
// 10:00:00,Kick off,Finn,Billy,Luca,Jacob,Knight,Harry B
// 10:02:00,Bill scored a goal,,,,,,
// 10:04:00,Finn scored a goal,,,,,,
// 10:30:00,Formation Change ,,,,,,
// ,,,,,,,
// 11:00:00,Final Whistle,Minecrafters,10,Calverton ,5,,

export function goal(name) {
  event(name + " scored");
}

export function change() {
  event("Substitution");
}

export function badGoal(name) {
  event(name + " goal disallowed");
}

export function final() {
  const when = new Date();
  const dateString = get("current");
  set(dateString, blanker);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  }).format(when);
  const otherName = document.getElementById("vrsNameDisplay2").innerText;
  const teamName = document.getElementById("teamNameDisplay2").innerText;
  const scored = document.getElementById("scored").innerText;
  const otherScored = document.getElementById("vrsScored").innerText;
  const evnt =
    time +
    ",Final Whistle," +
    teamName +
    "," +
    scored +
    "," +
    otherName +
    "," +
    otherScored;
  set(dateString, evnt);
  del("current");
}

const options = {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric"
};
const heading =
  "Time,Event,Front Left,Front Right,Left Back,Left Center,Back Right, Back Left, Goal";
const blanker = ",,,,,,,";

export function kickoff() {
  const when = new Date();
  const homeStore = get("home");
  const home = !homeStore || homeStore === "false" ? "away" : "home";
  const name = document.getElementById("teamNameDisplay2").innerText;
  const vrsName = document.getElementById("vrsNameDisplay2").innerText;
  const dateString = new Intl.DateTimeFormat("en-GB", options).format(when);

  const title =
    "Southwell City Under 8’s " +
    home +
    " game: " +
    name +
    " vrs " +
    vrsName +
    " on " +
    dateString +
    ",,,,,,,";

  put("current", dateString);
  set(dateString, title);
  set(dateString, blanker);
  set(dateString, heading);

  event("Kick off");
}

const event = what => {
  const when = new Date();
  const dateString = get("current");
  if (dateString === null) {
    return;
  }
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  }).format(when);

  const evnt = time + "," + what + "," + getForm();
  set(dateString, evnt);
};

export function paused() {
  event("paused");
}

export function restart() {
  event("restarted");
}

const getForm = () => {
  return (
    "" +
    document.getElementById("play-pitch--fl").innerText +
    "," +
    document.getElementById("play-pitch--fr").innerText +
    "," +
    document.getElementById("play-pitch--bl").innerText +
    "," +
    document.getElementById("play-pitch--bc").innerText +
    "," +
    document.getElementById("play-pitch--br").innerText +
    "," +
    document.getElementById("play-pitch--g").innerText
  );
};

export function penality() {
  event("penality");
}
