import { bagItAndTagIt, put, switchPlugin, togglePlugin } from "binder";
import { banner } from "./banner";
import { increment, timeFormat } from "./time";

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

const undo = evt => {
  console.log(evt);
  evt.element.classList.add("crossout");
  if (evt.state == null) {
    return;
  }
  const tag = evt.state === "concide" ? "vrsScore" : "score";
  changeScore(-1, tag);
};

const redo = evt => {
  console.log(evt);
  evt.element.classList.remove("crossout");
  if (evt.state == null) {
    return;
  }
  const tag = evt.state === "concide" ? "vrsScore" : "score";
  changeScore(1, tag);
};
const main = document.getElementById("results");

const resultRows = [];
const results = evt => {
  const time = document.createElement("div");
  time.classList.add("result");
  time.innerText = evt.time;

  const detail = document.createElement("div");
  detail.classList.add("result");
  detail.innerText = evt.detail;
  evt.element = detail;

  const del = document.createElement("button");
  del.classList.add("result");
  del.innerText = "X";
  del.addEventListener("click", () => {
    evt.crossedOut = !evt.crossedOut;
    if (evt.crossedOut) {
      undo(evt);
    } else {
      redo(evt);
    }
  });
  evt.id = resultRows.length;
  evt.crossedOut = false;

  main.appendChild(time);
  main.appendChild(detail);
  main.appendChild(del);

  resultRows.push(evt);
};

const kickoff = document.getElementById("kickoff");
kickoff.addEventListener("click", e => {
  e.target.style.display = "none";
  document.getElementById("playing").classList.remove("hide");
  document.getElementById("bench").classList.add("hide");
  document.getElementById("kickoff").classList.remove("hide");
  document.getElementById("state").classList.remove("hide");
  const time = timeFormat();
  results({ time, detail: "Kick off" });
  running = setInterval(increment, 1000);
  const scoreLabel = document.getElementById("score");
  scoreLabel.innerText = "0";
  const vrsScoreLabel = document.getElementById("vrsScore");
  vrsScoreLabel.innerText = "0";
  const state = document.getElementById("state");
  state.innerText === "Whistle blown";
  put(state);
});

const state = document.getElementById("state");
state.addEventListener("click", () => {
  if (running == null) {
    running = setInterval(increment, 1000);
    document.getElementById("playing").classList.remove("hide");
    document.getElementById("bench").classList.add("hide");
  } else {
    document.getElementById("playing").classList.add("hide");
    document.getElementById("bench").classList.remove("hide");
    clearInterval(running);
    running = null;
  }
});
const finished = document.getElementById("finished");
finished.addEventListener("click", () => {
  clearInterval(running);
  running = null;
  const time = timeFormat();
  results({ time, detail: "Final Whistle" });
  const date = new Date();

  let data = "";
  resultRows
    .filter(evt => !evt.crossedOut)
    .forEach(evt => {
      data = data + evt.time + ", " + evt.detail + "\n";
    });
  download(data, date + ".csv", "csv");
});

const download = (data, filename, type) => {
  const file = new Blob([data], { type });
  if (window.navigator.msSaveOrOpenBlob) {
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    // Others
    const a = document.createElement("a");

    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
};

const concede = document.getElementById("vrsScore");
concede.addEventListener("click", e => {
  const el = e.target;
  el.innerText = parseInt(el.innerText) + 1;
  const time = timeFormat();
  const name = document.getElementById("opposition").value;
  results({ time, detail: "Conceded a goal from " + name, state: "concide" });
});

const changeScore = (n, name = "score") => {
  const scoreLabel = document.getElementById(name);
  scoreLabel.innerText = parseInt(scoreLabel.innerText) + n;
};

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
