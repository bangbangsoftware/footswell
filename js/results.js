import { timeFormat } from "./time";
// import { get } from "binder";

let resultRows = [];
export function clear() {
  resultRows = [];
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

const replacePost = (from, to) => {
  const oldResult = resultRows.find(el => el.detail === from);
  oldResult.element.innerText = "" + to;
  oldResult.detail = "" + to;
};

const send = async (evt) => {
//  const yourNumber = get("phoneNo").currentValue;
  const yourMessage = evt.detail;
//  const number = yourNumber;
  if (!navigator.share) {
    console.error("web share not supported");
    return;
  }

  try {
    await navigator.share({
      title: "Footswell",
      text: yourMessage,
      url: window.location.href
    });
    console.log("Thanks for sharing!");
  } catch (err) {
    console.log(`Couldn't share because of`, err.message);
  }
  /** 
  const  message =  encodeURIComponent(yourMessage);
  
  console.log("https://api.whatsapp.com/send?phone=" + number + "&text=%20" + message);
  return fetch("https://api.whatsapp.com/send?phone=" + number + "&text=%20" + message);
*/
};

export function tracker(doc, main) {
  const changeScore = changer(doc);
  const undoToggleFn = undoToggle(changeScore);
  const sendFn = send;
  const post = postFn(doc, main, undoToggleFn, changeScore, sendFn);
  const download = downloadFn(doc);
  return {
    changeScore,
    post,
    replacePost,
    download
  };
}

const postFn = (doc, main, toggle, changeScore, sendFn) => evt => {
  evt.time = timeFormat();
  evt.id = resultRows.length;
  evt.crossedOut = false;

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

  const send = doc.createElement("button");
  send.createName = "send";
  send.classList.add("result");
  send.innerText = "Send";
  send.addEventListener("click", () => sendFn(evt));
  evt.id = "send" + resultRows.length;

  main.appendChild(time);
  main.appendChild(detail);
  main.appendChild(del);
  if (navigator.share){
    main.appendChild(send);
  } else {
    const lab = doc.createElement("label");
    lab.innerText = "- Not supported -";
    main.appendChild(lab);
  }

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
