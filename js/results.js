import { timeFormat } from "./time";

let resultRows = [];

export function clear() {
  resultRows = [];
}

export function tracker(doc, main) {
  const changeScore = (n, name = "score") => {
    const scoreLabel = doc.getElementById(name);
    scoreLabel.innerText = parseInt(scoreLabel.innerText) + n;
  };

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

  return {
    changeScore,
    post: evt => {
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
    },

    download: () => {
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
    }
  };
}
