import { setupScreen, tableSetup, playerSetup } from "./gears.js";

const toggleHome = (home, awayButt, homeButt) => {
  home = !home;
  if (home) {
    homeButt.classList.add("selected");
    awayButt.classList.remove("selected");
  } else {
    homeButt.classList.remove("selected");
    awayButt.classList.add("selected");
  }
  return home;
};

export function setupSetup(players) {
  setupScreen("setup");
  const bench = players.filter(player => player.place === "bench");
  const pitch = players.filter(player => player.place === "pitch");
  const noshow = players.filter(player => player.place === "noshow");
  tableSetup("bench", bench);
  tableSetup("noshow", noshow);
  playerSetup("setup-pitch", pitch);
  const homeButt = document.getElementById("home");
  const awayButt = document.getElementById("away");
  let home = true;
  const setHome = () => {
    home = toggleHome(home, awayButt, homeButt);
    window.localStorage.setItem("home", "" + home);
  };
  homeButt.addEventListener("click", setHome);
  awayButt.addEventListener("click", setHome);
}
