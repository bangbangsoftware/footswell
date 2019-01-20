import {get, put} from './store.js';

export function tableSetup(id, players, benchers = []) {
  const main = document.getElementById(id);
  players.forEach((player, index) => {
    const innerText = index + 1 > benchers.length ? "" : benchers[index].name;
    const className = "name";
    const button = createButton(innerText, className, id + "--" + (index + 1));
    main.appendChild(button);
  });
}


const formClass = ["fl", "fr", "bl", "bc", "br", "g"];
export function playerSetup(id, onPitch) {
  const main = document.getElementById(id);
  onPitch
    .map((player, index) =>
      createButton(player.name, formClass[index], id + "--" + (index + 1))
    )
    .forEach(button => main.appendChild(button));
}

const selected = { last: new Date(), button: null, first: false };

const standardSwap = button => {
  if (selected.first) {
    const text = button.innerText;
    button.innerText = "" + selected.button.innerText;
    selected.button.innerText = "" + text;
    selected.button.classList.remove("selected");
    store();
  } else {
    button.classList.add("selected");
  }
  selected.first = !selected.first;
  selected.button = button;
};

const store = () =>{
  const hist = get("history");
  const history = (hist)? JSON.parse(hist): [];
  const players = listPlayers();
  history.push({date:new Date(),players});
  set("history", JSON.stringify(history));

  const playerString = JSON.stringify(players);
  set("players", playerString);
}

export function updateButton(updates){
  buttonList.map(button =>{
    const change = updates.find(update => update.old.name === button.innerText);
    if (!change){
      return button;
    }
    button.innerText = ""+change.new.name;
  });
}

const buttonList = [];

const createButton = (
  text,
  classname,
  id,
  fn = button => standardSwap(button)
) => {
  const button = document.createElement("button");
  button.id = id;
  button.classList = [classname];
  button.innerText = text;
  button.addEventListener("click", () => fn(button));
  buttonList.push(button);
  return button;
};

export function listPlayers() {
  return buttonList
    .filter(button => button.innerText !== "")
    .map(button => {
      const id = button.id;
      const place = id.substring(0, id.indexOf("--"));
      const name = button.innerText;
      return { name, place };
    });
}
