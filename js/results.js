import { timeFormat } from "./time";

let resultRows = [];
export function clear() {
  resultRows = [];
}

const changer = doc => (n, name = "score") => {
  const scoreLabel = doc.getElementById(name);
  scoreLabel.innerText = parseInt(scoreLabel.innerText) + n;
};

const undo = changeScore => evt => {
  evt.element.classList.add("crossout");
  if (evt.state == null) {
    return;
  }
  const tag = evt.state === "concide" ? "vrsScore" : "score";
  changeScore(-1, tag);
};

const redo = changeScore => evt => {
  evt.element.classList.remove("crossout");
  if (evt.state == null) {
    return;
  }
  const tag = evt.state === "concide" ? "vrsScore" : "score";
  changeScore(1, tag);
};

const undoToggle = (undo, redo) => evt => {
  evt.crossedOut = !evt.crossedOut;
  if (evt.crossedOut) {
    undo(evt);
  } else {
    redo(evt);
  }
};

export function tracker(doc, main) {
  const changeScore = changer(doc);
  const undoFn = undo(changeScore);
  const redoFn = redo(changeScore);
  const undoToggleFn = undoToggle(undoFn, redoFn);
  const post = add(doc, main, undoToggleFn);
  const download = output(doc);
  return {
    changeScore,
    post,
    download
  };
}

const add = (doc, main, toggle) => evt => {
  evt.time = timeFormat();

  const time = doc.createElement("div");
  time.classList.add("result");
  time.innerText = evt.time;

  const detail = doc.createElement("div");
  detail.classList.add("result");
  detail.innerText = evt.detail;
  evt.element = detail;

  const del = doc.createElement("button");
  del.classList.add("result");
  del.innerText = "X";
  del.addEventListener("click", () => toggle(evt));
  evt.id = resultRows.length;
  evt.crossedOut = false;

  main.appendChild(time);
  main.appendChild(detail);
  main.appendChild(del);

  resultRows.push(evt);
};

const output = doc => () => {
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
