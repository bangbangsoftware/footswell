export function increment() {
  const seconds = document.getElementById("seconds");
  const minutes = document.getElementById("minutes");
  const secs = parseInt(seconds.innerText) + 1;
  if (secs > 59) {
    incrementSeconds(minutes, seconds);
    return;
  }
  seconds.innerText = secs < 10 ? `0${secs}` : secs;
}

export function reset() {
  document.getElementById("seconds").innerText = "00";
  document.getElementById("seconds").classList.remove("red");
  document.getElementById("minutes").innerText = "00";
  document.getElementById("minutes").classList.remove("red");
}

export function timeFormat() {
  const date = new Date();
  const hr = zeroFill(date.getHours());
  const mn = zeroFill(date.getMinutes());
  const sc = zeroFill(date.getSeconds());
  return `${hr}:${mn}:${sc}`;
}

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

const zeroFill = i => {
  if (i < 10) {
    return "0" + i;
  }
  return i;
};
