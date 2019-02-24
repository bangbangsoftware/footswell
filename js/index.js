import { bagItAndTagIt, put, switchPlugin, togglePlugin } from "binder";

console.log(
  "     ,...                                                             ,,    ,,"
);
console.log(
  '   .d\'""                mm                                        `7MM  `7MM '
);
console.log(
  "   dM`                    MM                                          MM    MM  "
);
console.log(
  '  mMMmm,pW"Wq.   ,pW"Wq.mmMMmm     ,pP"Ybd `7M\'    ,A    `MF\'.gP"Ya   MM    MM  '
);
console.log(
  "   MM 6W'   `Wb 6W'   `Wb MM       8I   `\"   VA   ,VAA   ,V ,M'   Yb  MM    MM  "
);
console.log(
  '   MM 8M     M8 8M     M8 MM       `YMMMa.    VA ,V  VA ,V  8M""""""  MM    MM  '
);
console.log(
  "   MM YA.   ,A9 YA.   ,A9 MM       L.   I8     VVV    VVV   YM.    ,  MM    MM  "
);
console.log(
  " .JMML.`Ybmd9'   `Ybmd9'  `Mbmo    M9mmmP'      W      W     `Mbmmd'.JMML..JMML.-->"
);

bagItAndTagIt([switchPlugin, togglePlugin]);

const incrementSeconds = (minutes, seconds) => {
  seconds.innerText = 0;
  const mins = parseInt(minutes.innerText) + 1;
  if (mins < 10) {
    minutes.innerText = "0" + mins;
    return;
  }
  minutes.innerText = mins;
  seconds.classList.add("red");
  minutes.classList.add("red");
};

const increment = () => {
  const seconds = document.getElementById("seconds");
  const minutes = document.getElementById("minutes");
  const secs = parseInt(seconds.innerText) + 1;
  if (secs > 59) {
    incrementSeconds(minutes, seconds);
    return;
  }
  seconds.innerText = secs < 10 ? `0${secs}` : secs;
};

const zeroFill = i => {
  if (i < 10) {
    return "0" + i;
  }
  return i;
};

const timeFormat = () => {
  const date = new Date();
  const hr = zeroFill(date.getHours());
  const mn = zeroFill(date.getMinutes());
  const sc = zeroFill(date.getSeconds());
  return `${hr}:${mn}:${sc}`;
};

const main = document.getElementById("results");

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
let running = null;
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

  download(JSON.stringify(resultRows), date + ".csv", "csv");
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
  results({ time, detail: "Conceded a goal by " + name, state: "concide" });
});

for (let n = 1; n < 22; n++) {
  const el = document.getElementById("position" + n);
  try {
    el.addEventListener("click", e => playerScored(e));
  } catch (ex) {
    console.error(n + ". failed is it in the markup?");
    console.error(ex);
  }
}

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
