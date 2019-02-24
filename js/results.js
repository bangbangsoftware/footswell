export function changeScore(n, name = "score") {
  const scoreLabel = document.getElementById(name);
  scoreLabel.innerText = parseInt(scoreLabel.innerText) + n;
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
export function results(evt) {
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
}

export function download(resultRows) {
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
}
