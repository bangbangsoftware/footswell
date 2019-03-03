import { timeFormat } from "./time";

let resultRows = [];
export function clear() {
  resultRows = [];
}

export function get() {
  return resultRows.map(m => m);
}

const changer = doc => (num, name = "score") => {
  const scoreLabel = doc.getElementById(name);
  scoreLabel.innerText = parseInt(scoreLabel.innerText) + num;
};

const adjustGoal = (changeScore, evt, adjust = 1) => {
  if (adjust < 1) {
    evt.element.classList.add("crossout");
  } else {
    evt.element.classList.remove("crossout");
  }
  if (evt.state == null) {
    return;
  }
  const tag = evt.state === "concide" ? "vrsScore" : "score";
  changeScore(adjust, tag);
};

const undoToggle = changeScore => evt => {
  evt.crossedOut = !evt.crossedOut;
  const adjust = evt.crossedOut ? -1 : 1;
  adjustGoal(changeScore, evt, adjust);
};

export function tracker(doc, main) {
  const changeScore = changer(doc);
  const undoToggleFn = undoToggle(changeScore);
  const post = postFn(doc, main, undoToggleFn, changeScore);
  const download = downloadFn(doc);
  return {
    changeScore,
    post,
    download
  };
}

const postFn = (doc, main, toggle, changeScore) => evt => {

  evt.time = timeFormat();

  const time = doc.createElement("div");
  time.createName = "time";
  time.classList.add("result");
  time.innerText = evt.time;

  const detail = doc.createElement("div");
  detail.createName = "result";
  detail.classList.add("result");
  detail.innerText = evt.detail;
  evt.element = detail;

  const del = doc.createElement("button");
  del.createName = "deleteToggle";
  del.classList.add("result");
  del.innerText = "X";
  del.addEventListener("click", () => toggle(evt));
  evt.id = resultRows.length;
  evt.crossedOut = false;

  main.appendChild(time);
  main.appendChild(detail);
  main.appendChild(del);

  resultRows.push(evt);

  if (evt.state != null) {
    adjustGoal(changeScore, evt, 1);
  }

  return evt;
};

const downloadFn = doc => () => {
  const date = new Date();

  let data = "";
  resultRows
    .filter(evt => !evt.crossedOut)
    .forEach(evt => {
      data = data + evt.time + ", " + evt.detail + "\n";
    });
  const filename = date + ".csv";
  const type = "csv";
  const file = new Blob([data], { type });
  if (window.navigator.msSaveOrOpenBlob) {
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
    return;
  }
  // Others
  const a = doc.createElement("a");

  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  doc.body.appendChild(a);
  a.click();
  setTimeout(() => {
    doc.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};
