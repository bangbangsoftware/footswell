import { put, set } from "./persist.js";

export function goal() {
  const formation = getForm();
  set("score", { goal, formation });
}

export function kickoff() {
  const when = new Date();
  const formation = getForm();
  put("kickoff", { when, formation });
}

const getForm = () => {
  return {};
};

export function penality() {}
