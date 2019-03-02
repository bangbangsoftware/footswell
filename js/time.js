export function timer(minutesElement, secondsElement, underLimit = 10) {
  const increment = incrementFn(minutesElement, secondsElement, underLimit);
  const reset = resetFn(minutesElement, secondsElement, underLimit);
  return {
    increment,
    reset
  };
}

const incrementFn = (minutesElement, secondsElement, underLimit) => () => {
  const secs = parseInt(secondsElement.innerText) + 1;
  if (secs > 59) {
    incrementSeconds(minutesElement, secondsElement, underLimit);
    return;
  }
  secondsElement.innerText = secs < 10 ? `0${secs}` : secs;
};

const resetFn = (minutesElement, secondsElement) => () => {
  secondsElement.innerText = "00";
  secondsElement.classList.remove("red");
  minutesElement.innerText = "00";
  minutesElement.classList.remove("red");
};

export function timeFormat(date = new Date()) {
  const hr = zeroFill(date.getHours());
  const mn = zeroFill(date.getMinutes());
  const sc = zeroFill(date.getSeconds());
  return `${hr}:${mn}:${sc}`;
}

const incrementSeconds = (minutes, seconds, underLimit) => {
  seconds.innerText = 0;
  const mins = parseInt(minutes.innerText) + 1;
  if (mins < underLimit) {
    minutes.innerText = "0" + mins;
    return;
  }
  minutes.innerText = zeroFill(mins);
  seconds.classList.add("red");
  minutes.classList.add("red");
};

const zeroFill = i => {
  if (i < 10) {
    return "0" + i;
  }
  return i;
};
