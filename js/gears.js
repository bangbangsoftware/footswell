//import { put, get, sub } from "./persist.js";
import { put, reg } from "./data.js";

export function tableSetup(id, names = []) {
  const main = document.getElementById(id);
  [1, 2, 3, 4].forEach(index => {
    const innerText = index > names.length ? "\t" : names[index - 1].name;
    const className = "setup-name";
    const button = createButton(innerText, className, `${id}--${index + 1}`);
    main.appendChild(button);
  });
}

const fixPlayer = onPitch => {
  return onPitch
    .map((player, index) => {
      if (player.position) {
        return player;
      }
      player.position = formClass[index];
      return player;
    })
    .filter(player => player.name.trim().length > 0);
};

const formClass = ["fl", "fr", "bl", "bc", "br", "g"];
export function playerSetup(id, players, fn) {
  const onPitch = fixPlayer(players);
  const main = document.getElementById(id);
  const name = `${id}--`;
  formClass
    .map(cls => {
      const player = onPitch.find(p => p.position === cls);
      if (player) {
        return createButton(player.name, cls, name + cls, fn);
      }
    })
    .forEach(button => main.appendChild(button));
}

const selected = { last: new Date(), button: [], first: false };

const standardSwap = button => {
  if (selected.first) {
    const text = `${button.innerText}`;
    const oldBut = selected.button.pop();
    button.innerText = `${oldBut.innerText}`;
    oldBut.innerText = `${text}`;
    oldBut.classList.remove("selected");
    store();
  } else {
    button.classList.add("selected");
  }
  selected.first = !selected.first;
  selected.button.push(button);
};

const store = () => {
  const players = listPlayers();
};

const getIndex = update => {
  return buttonList.map((button, index) => {
    return (update.old.name === button.innerText) ? index : false;
  }).find(index => index);
};

export function updateButton(updates) {
  const butIndexes = updates.map(update => getIndex(update));
  butIndexes.forEach((bi,i) =>{
    const change = updates[i];
    buttonList[i].innerText = `${change.new.name}`;
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
      const position = button.classList[0];
      const name = button.innerText;
      return { name, place, position };
    });
}

const pages = [];
export function setupScreen(id) {
  const screen = document.getElementById(id);
  const button = document.getElementById(`${id}But`);
  button.addEventListener("click", () => {
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
  const adfunc = adder(holder, name, id, button, row, take);
  button.onclick = () => adfunc();
  return button;
};

const adder = (holder, name, id, add, row, take) => () => {
  add.classList.add("hide");
  row.appendChild(take);
  const field = createField(holder, name, "", id + 1);
  fields.push(field);
  listen(field, () => save(fields));
};

const createField = (holder, name, value, id, more = true) => {
  const row = document.createElement("div");

  const field = document.createElement("input");
  field.value = value;
  field.id = `${name}--${id}`;
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
  //  field.addEventListener("keypress", e => {
  //    if (event.which == 13 || event.keyCode == 13) {
  //      adder(holder, name, id, row, takeBut);
  //    }
  //  });
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

  const main = document.getElementById(`${id}Input`);
  const display = document.getElementById(`${id}Display`);

  main.value = value;
  display.innerText = value;

  listen(main, e => put(e.target.id, e.target));

  const display2 = document.getElementById(`${id}Display2`);
  reg(display2.id,display2);

  main.value = value;
  display2.innerText = value;

  
}

let fields = [];
export function setupFields(name, values = [""]) {
  const main = document.getElementById(name);
  const holder = document.createElement("div");
  holder.classList.add("fieldGrid");
  fields = values.map((value, i) => {
    const field = createField(holder, name, value, i, i + 1 !== values.length);
    listen(field, () => save(fields));
    return field;
  });
  main.appendChild(holder);
  return fields;
}