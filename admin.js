import { setupScreen } from "./gears.js";
import { reset, getAll, importData, get } from "./persist.js";

export function setupAdmin() {
  setupScreen("admin");
  const resetBut = document.getElementById("reset");
  resetBut.addEventListener("click", () => {
    console.log("deleted", reset());
  });
  const exportBut = document.getElementById("export");
  exportBut.addEventListener("click", () => {
    const data = getAll();
    const dataString = JSON.stringify(data, null, 2);
    download(dataString, "footswell.json", "json");
  });
  const importBut = document.getElementById("upload");
  importBut.addEventListener("change", e => {
    console.log(e);
    const file = e.target.files[0];
    printFile(file);
  });
  const gameList = get("games");
  if (gameList) {
    setupGames(gameList);
  }
}

const setupGames = gameList => {
  const games = document.getElementById("games");
  const SeeGameSetup = matchDiv => () => {
    if (matchDiv.classList.contains("hide")) {
      matchDiv.classList.remove("hide");
    } else {
      matchDiv.classList.add("hide");
    }
  };
  const DownGameSetup = (details, date) => () => {
    download(details.join("\n"), date + ".csv", "csv");
  };
  console.log("length ", gameList.length, gameList);
  gameList.map((date, index) => {
    const gameButton = document.createElement("button");
    const gameDownloadButton = document.createElement("button");
    const matchDiv = document.createElement("div");
    matchDiv.classList.add("match");
    matchDiv.classList.remove("hide");
    const details = get(date);
    console.log(details);
    const eachRow = details.map((d, index) => {
      const elements = d
        .split(",")
        .map(d => {
          const div = "<div>" + d + "</div>";
          return div;
        })
        .join("\n");
      if (index < 3 || index+3 > details.length) {
        return "<div class='match-row header'>" + elements + "</div>";
      }
      return "<div class='match-row '>" + elements + "</div>";
    });
    const matchTable = eachRow.join("\n\n");
    matchDiv.innerHTML = matchTable;
    const seeGame = SeeGameSetup(matchDiv);
    const downGame = DownGameSetup(details, date);
    matchDiv.classList.add("hide");
    gameButton.innerHTML = date;
    gameButton.classList.add("vrsButton");
    gameButton.id = "game-" + index;
    gameButton.addEventListener("click", seeGame);

    gameDownloadButton.innerHTML = "DOWNLOAD";
    gameDownloadButton.classList.add("vrsButton");
    gameDownloadButton.id = "game-down-" + index;
    gameDownloadButton.addEventListener("click", downGame);

    games.appendChild(gameButton);
    games.appendChild(gameDownloadButton);
    games.appendChild(matchDiv);
  });
};

function printFile(file) {
  const reader = new FileReader();
  reader.onload = evt => {
    const dataString = evt.target.result;
    const data = JSON.parse(dataString);
    importData(data);
  };
  reader.readAsText(file);
}
// Function to download data to a file
function download(data, filename, type) {
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
