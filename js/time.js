export function timer(minutesElement, secondsElement, underLimit = 30) {
  const adjust = adjustFn(minutesElement, secondsElement, underLimit);
  const reset = resetFn(minutesElement, secondsElement, underLimit);
  return {
    reset,
    adjust
  };
}

const timeDiff = totalSeconds => {
  if (totalSeconds < 60) {
    const minutes = 0;
    const seconds = totalSeconds;
    return { minutes, seconds };
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return { minutes, seconds };
};

const adjustFn = (minutesElement, secondsElement, underLimit) => updatedAt => {
  const now = new Date();
  const totalSeconds = Math.round((now.getTime() - updatedAt.getTime()) / 1000);
  const toAdd = timeDiff(totalSeconds);
  incrementMinutes(minutesElement, secondsElement, underLimit, toAdd.minutes);
  incrementSeconds(minutesElement, secondsElement, underLimit, toAdd.seconds);
  return now;
};

const incrementSeconds = (minutesElement, secondsElement, underLimit, by) => {
  const secs = parseInt(secondsElement.innerText) + by;
  if (secs > 59) {
    secondsElement.innerText = "00";
    incrementMinutes(minutesElement, secondsElement, underLimit);
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

const incrementMinutes = (minutes, seconds, underLimit, by = 1) => {
  const mins = parseInt(minutes.innerText) + by;
  if (mins == underLimit) {
    seconds.classList.add("red");
    minutes.classList.add("red");
  }
  minutes.innerText = zeroFill(mins);
};

const zeroFill = i => {
  if (i < 10) {
    return "0" + i;
  }
  return i;
};
