import { setupScreen } from "./gears.js";
import { reset, getAll, importData } from "./persist.js";

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
  importBut.addEventListener("change", (e) => {
    console.log(e);
    const file = e.target.files[0];
    printFile(file);
  });
}
function printFile(file) {
  const reader = new FileReader();
  reader.onload = (evt) => {
    const dataString = evt.target.result;
    const data = JSON.parse(dataString);
    importData(data);
  };
  reader.readAsText(file);
}
// Function to download data to a file
function download(data, filename, type) {
  const file = new Blob([data], { type });
  if (window.navigator.msSaveOrOpenBlob)
  // IE10+
  { window.navigator.msSaveOrOpenBlob(file, filename); } else {
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
