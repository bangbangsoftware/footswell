import { timer, timeFormat } from "./time";

describe("Timer...", () => {
  const classReg = {};
  const classList = id => {
    return { remove: () => (classReg[id] = {}), add: t => (classReg[id] = t) };
  };
  const minutesElement = { innerText: 0, classList: classList("m") };
  const secondsElement = { innerText: 0, classList: classList("s") };
  const underLimit = 2;
  const clock = timer(minutesElement, secondsElement, underLimit);

  it("should get a clock", () => {
    expect(clock).toBeDefined();
  });

  // increment removed and replaced by adjust which works relative to a date
  xit("should be able to increment", () => {
    clock.increment();
    expect(secondsElement.innerText).toBe("01");
  });

  xit("should be able to increment to a minute", () => {
    for (let x = 0; x < 60; x++) {
      clock.increment();
    }
    expect(secondsElement.innerText).toBe("01");
    expect(minutesElement.innerText).toBe("01");

    for (let x = 0; x < 60; x++) {
      clock.increment();
    }
    expect(secondsElement.innerText).toBe("01");
    expect(minutesElement.innerText).toBe("02");
    expect(classReg.m).toBe("red");
    expect(classReg.s).toBe("red");

    clock.reset();
    expect(secondsElement.innerText).toBe("00");
    expect(minutesElement.innerText).toBe("00");
    expect(classReg.s+"").toBe(""+{});
  });

  it("should be able to render some time", () => {
    const toRender = new Date("July 21, 2020 08:00:00");
    expect(timeFormat(toRender)).toMatchSnapshot();
  });
});
