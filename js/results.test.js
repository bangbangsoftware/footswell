import { tracker, clear, get } from "./results";

const mockElement = t => {
  const clazzez = [];
  const tag = t;
  const events = {};
  const elements = [];
  return {
    classList: {
      add: clazz => clazzez.push(clazz),
      remove: clazz => {
        const index = clazzez.indexOf(clazz);
        clazzez.splice(index);
      }
    },
    tag,
    addEventListener: (eventName, fn) => {
      events[eventName] = fn;
    },
    appendChild: el => elements.push(el),
    children: elements,
    events,
    fire: eventName => events[eventName]({})
  };
};

const scoredLabel = {innerText:0};
const vrsScoredLabel = {innerText:0};
const mockDoc = {
  createElement: tag => {
    return mockElement(tag);
  },
  getElementById: id => {
    if (id === "score"){
      return scoredLabel;
    }
    return vrsScoredLabel;
  }
};

let mechanics;
let main = mockDoc.createElement("div");
beforeAll(() => {
  clear();
  mechanics = tracker(mockDoc, main);
});

describe("How results are tracked", () => {
  
  it("should have populated via the tracker", () => {
    expect(mechanics.changeScore).toBeDefined();
    expect(mechanics.post).toBeDefined();
    expect(mechanics.download).toBeDefined();
  });

  it("should be able to post an event", () => {
    const ev = { detail: "Kick Off" };
    const evUpdated = mechanics.post(ev);
    expect(evUpdated.element.tag).toBe("div");
    const results = get();
    expect(results.length).toBe(1);
    expect(results[0].crossedOut).toBe(false);
    expect(main.children.length).toBe(3);
    expect(scoredLabel.innerText).toBe(0);
  });

  it("should be able to crossout a result via a click", () => {
    main.children[2].fire("click");
    const now = get();
    expect(now[0].crossedOut).toBe(true);
    main.children[2].fire("click");
    const andNow = get();
    expect(andNow[0].crossedOut).toBe(false);
  });

  it("should be able to post an scored event", () => {
    const ev = { detail: "Finn Scored!!", state:"scored" };
    const evUpdated = mechanics.post(ev);
    expect(evUpdated.element.tag).toBe("div");
    const results = get();
    expect(results.length).toBe(2);
    expect(results[0].crossedOut).toBe(false);
    expect(main.children.length).toBe(6);
  });

  it("should be able to post concide event", () => {
    const ev = { detail: "Finn Scored!!", state:"concide" };
    const evUpdated = mechanics.post(ev);
    expect(evUpdated.element.tag).toBe("div");
    const results = get();
    expect(results.length).toBe(3);
    expect(results[0].crossedOut).toBe(false);
    expect(main.children.length).toBe(9);
    expect(vrsScoredLabel.innerText).toBe(1);
    main.children[8].fire("click");
    expect(vrsScoredLabel.innerText).toBe(0);
  });

  it("should be able to crossout a scored event result via a click", () => {
    main.children[5].fire("click");
    const now = get();
    expect(now[1].crossedOut).toBe(true);
    expect(scoredLabel.innerText).toBe(0);
    main.children[5].fire("click");
    const andNow = get();
    expect(andNow[0].crossedOut).toBe(false);
    expect(scoredLabel.innerText).toBe(1);
  });

});
