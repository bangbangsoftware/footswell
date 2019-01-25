import { put, get, sub } from "./persist.js";

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
export function playerSetup(id, onPitch, fn) {
  const main = document.getElementById(id);
  const name = id + "--";
  onPitch
    .map((player, index) =>
      createButton(player.name, formClass[index], name + (index + 1), fn)
    )
    .forEach(button => main.appendChild(button));
}

const selected = { last: new Date(), button: [], first: false };

const standardSwap = button => {
  if (selected.first) {
    const text = ""+ button.innerText;
    const oldBut = selected.button.pop();
    button.innerText = "" + oldBut.innerText;
    oldBut.innerText = "" + text;
    oldBut.classList.remove("selected");
    store();
  } else {
    button.classList.add("selected");
  }
  selected.first = !selected.first;
  selected.button.push(button);
};

const store = () => {
  const hist = get("history");
  const history = hist ? hist : [];
  const players = listPlayers();
  history.push({ date: new Date(), players });
  put("history", history);

  const playerString = players;
  put("players", playerString);
};

export function updateButton(updates) {
  buttonList.map(button => {
    const change = updates.find(update => update.old.name === button.innerText);
    if (!change) {
      return button;
    }
    button.innerText = "" + change.new.name;
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
    .filter(button => button.innerText !== "" && !button.id.startsWith("play"))
    .map(button => {
      const id = button.id;
      const start = button.id.startsWith("setup") ? 6 : 0;
      const place = id.substring(start, id.indexOf("--"));
      const name = button.innerText;
      return { name, place };
    });
}

const pages = [];
export function setupScreen(id) {
  const screen = document.getElementById(id);
  const button = document.getElementById(id + "But");
  button.addEventListener("click", () => {
    console.log(listPlayers());
    const hidden = screen.classList.contains("hide");
    pages.forEach(page => {
      page.screen.classList.add("hide");
      page.button.classList.remove("selected");
    });
    if (hidden) {
      screen.classList.remove("hide");
      button.classList.add("selected");
    }
  });
  const page = { screen, button };
  pages.push(page);
}

const createTakeBut = field => {
  const button = document.createElement("button");
  button.innerText = "-";
  button.classList.add("fieldBut");
  button.onclick = () => {
    field.value = "";
  };
  return button;
};

const createAddBut = (holder, name, id, row, take) => {
  const button = document.createElement("button");
  button.innerText = "+";
  button.classList.add("fieldBut");
  button.onclick = () => {
    adder(holder, name, id, row, take);
  };
  return button;
};

const adder = (holder, name, id, add, row, take) => {
  add.classList.add("hide");
  row.appendChild(take);
  createField(holder, name, "", id + 1);
};

const createField = (holder, name, value, id, more = true) => {
  const row = document.createElement("div");

  const field = document.createElement("input");
  field.value = value;
  field.id = name + "--" + id;
  field.classList.add("field");
  field.focus();

  const takeBut = createTakeBut(field);
  const addBut = createAddBut(holder, name, id, row, takeBut);

  row.appendChild(field);
  if (value && more) {
    row.appendChild(takeBut);
  } else {
    row.appendChild(addBut);
  }
  row.classList.add("fieldRow");
  holder.appendChild(row);
  return field;
};

const listen = (field, fn) => {
  const changed = e => fn(e);
  field.addEventListener("change", e => changed(e));
  field.addEventListener("keypress", e => {
    if (event.which == 13 || event.keyCode == 13) {
      adder(holder, name, id, row, takeBut);
    }
  });
  field.addEventListener("onpaste", e => changed(e));
  field.addEventListener("oninput", e => changed(e));
};

const save = fields => {
  const players = fields.map((field, index) => {
    const place = index > 5 ? "bench" : "pitch";
    return { name: field.value, place };
  });
  put("players", players);
};

export function setupTeamName(id = "teamName") {
  const stored = get(id);
  const value = stored ? stored.name : "";
  sub(id, delta => {
    display.innerText = delta.new.name;
  });

  const main = document.getElementById(id + "Input");
  const display = document.getElementById(id + "Display");

  main.value = value;
  display.innerText = value;

  listen(main, e => {
    const name = e.target.value;
    put(id, { name });
    display.innerText = name;
  });

  const display2 = document.getElementById(id + "Display2");

  main.value = value;
  display2.innerText = value;

  listen(main, e => {
    const name = e.target.value;
    display2.innerText = name;
  });
}

export function setupFields(name, values = [""]) {
  const main = document.getElementById(name);
  const holder = document.createElement("div");
  holder.classList.add("fieldGrid");
  const fields = values.map((value, i) => {
    const field = createField(holder, name, value, i, i + 1 !== values.length);
    listen(field, e => save(fields));
    return field;
  });
  main.appendChild(holder);
  return fields;
}
